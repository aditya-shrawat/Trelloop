import mongoose from "mongoose";
import Workspace from "../models/workspace.js";

const checkWorkspaceAccess = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Valid Workspace ID is required." });
    }

    const workspace = await Workspace.findById(id);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found." });
    }

    const userId = req.user._id.toString();
    const isMember = workspace.members.some(memberId => memberId.toString() === userId);
    const isCreator = workspace.createdBy?.toString() === userId;

    if (workspace.isPrivate && !(isMember || isCreator)) {
      return res.status(403).json({ error: "Access denied to private workspace." });
    }

    const canEdit = isMember || isCreator;

    req.canEdit = canEdit;
    req.workspace = workspace;
    req.isCreator = isCreator;

    next();
  } catch (error) {
    console.log('Error in checkWorkspaceAccess- ', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export default checkWorkspaceAccess;


