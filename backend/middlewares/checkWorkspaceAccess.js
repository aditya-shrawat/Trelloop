import Workspace from "../models/workspace.js";


const checkWorkspaceAccess = async (req,res,next)=> {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({error:'Workspace not found.'});
    }

    const isMember = workspace.members.includes(userId);
    const isCreator = workspace.createdBy.toString() === userId;

    if (workspace.isPrivate && !(isMember || isCreator)){
      return res.status(403).json({error:'Access denied to private workspace.' });
    }

    let canEdit = false;
    if (isCreator || isMember) {
      canEdit = true;
    }

    req.canEdit = canEdit;
    req.workspace = workspace;
    req.isCreator = isCreator;

    next();
  } catch (error) {
    console.log('Error in checkWorkspaceAccess- ',error);
    return res.status(500).json({error:'Internal server error.'});
  }
};

export default checkWorkspaceAccess;


