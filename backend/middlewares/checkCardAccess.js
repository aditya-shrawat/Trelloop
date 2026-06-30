import mongoose from "mongoose";
import Board from "../models/board.js";
import Card from "../models/card.js";
import List from "../models/list.js";

const checkCardAccess = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ error: "Valid Card ID is required." });
    }

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ error: "Card not found" });

    const list = await List.findById(card.list);
    if (!list) return res.status(404).json({ error: "List not found" });

    const board = await Board.findById(list.board);
    if (!board) return res.status(404).json({ error: "Board not found" });

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
      console.log("public")
      canView = true;
    } else if (board.visibility === "Workspace") {
      console.log("workspace")
      canView = hasElevatedRole || isWorkspaceMember;
    } else if (board.visibility === "Private") {
      console.log("Private")
      canView = hasElevatedRole;
    }

    if (!canView) {
      return res.status(403).json({ error: "Access denied to this card" });
    }

    let canEdit = false;
    if (board.visibility === "Private") {
      canEdit = hasElevatedRole;
    } else {
      canEdit = hasElevatedRole || isWorkspaceMember;
    }

    req.canEdit = canEdit;
    req.list = list;
    req.card = card;

    next();
  } catch (error) {
    console.log('Error in checkCardAccess- ', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export default checkCardAccess;