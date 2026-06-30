import Board from "../models/board.js";
import mongoose from "mongoose";


const checkBoardAccess = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ error: "Valid Board ID is required." });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found." });
    }

    await board.populate("workspace");
    const workspace = board.workspace;

    const userId = req.user._id.toString();
    const isBoardMember = board.members.some(id => id.toString() === userId);
    const isBoardAdmin = board.admin?.toString() === userId;
    const isWorkspaceMember = workspace.members.some(id => id.toString() === userId);
    const isWorkspaceAdmin = workspace.createdBy?.toString() === userId;

    const hasElevatedRole = isBoardMember || isBoardAdmin || isWorkspaceAdmin;

    let canView = false;
    if (board.visibility === "Public") {
      canView = true;
    } else if (board.visibility === "Workspace") {
      canView = hasElevatedRole || isWorkspaceMember;
    } else if (board.visibility === "Private") {
      canView = hasElevatedRole;
    }

    if (!canView) {
      return res.status(403).json({ error: "Access denied to this board." });
    }

    let canEdit = false;
    if (board.visibility === "Private") {
      canEdit = hasElevatedRole;
    } else {
      canEdit = hasElevatedRole || isWorkspaceMember;
    }

    req.canEdit = canEdit;
    req.isBoardAdmin = isBoardAdmin;
    req.isWorkspaceAdmin = isWorkspaceAdmin;

    next();
  } catch (error) {
    console.log('Error in checkBoardAccess- ', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export default checkBoardAccess;


