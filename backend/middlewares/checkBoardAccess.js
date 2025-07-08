import Board from "../models/board.js";


const checkBoardAccess = async (req,res,next)=> {
  try {
    const userId = req.user.id;
    const { boardId } = req.params;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({error:'Board not found.'});
    }

    await board.populate("workspace")
    const workspace = board.workspace ;

    const isBoardMember = board.members.some(id => id.toString() === userId);
    const isWorkspaceMember = workspace.members.some(id => id.toString() === userId);
    const isBoardAdmin = board.admin?.toString() === userId;
    const isWorkspaceAdmin = workspace.createdBy?.toString() === userId;

    if(board.visibility === 'Workspace' && (!isWorkspaceAdmin && !isWorkspaceMember && !isBoardAdmin && !isBoardMember)){
      return res.status(403).json({error:"Access denied to this board."})
    }

    if(board.visibility === 'Private' && (!isBoardAdmin && !isBoardMember && !isWorkspaceAdmin)){
      return res.status(403).json({error:"Access denied to this board."})
    }

    let canEdit = false;
    if (board.visibility === "Workspace" && (isBoardMember || isWorkspaceMember || isBoardAdmin || isWorkspaceAdmin)) {
      canEdit = true;
    } else if (board.visibility === "Private" && (isBoardMember || isWorkspaceAdmin || isBoardAdmin)) {
      canEdit = true;
    } else if (board.visibility === "Public" && (isBoardMember || isWorkspaceMember || isBoardAdmin || isWorkspaceAdmin)) {
      canEdit = true;
    }

    req.canEdit = canEdit;
    req.isBoardAdmin = isBoardAdmin;
    req.isWorkspaceAdmin = isWorkspaceAdmin;

    next();
  } catch (error) {
    console.log('Error in checkBoardAccess- ',error);
    return res.status(500).json({error:'Internal server error.'});
  }
};

export default checkBoardAccess;


