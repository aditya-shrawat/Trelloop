import Board from "../models/board.js";
import Card from "../models/card.js";
import List from "../models/list.js";


const checkCardAccess = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    if(!cardId) return res.status(400).json({ error: "Card ID is required." });

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ error: "Card not found" });

    const list = await List.findById(card.list);
    if (!list) return res.status(404).json({ error: "List not found" });

    const board = await Board.findById(list.board)
    if (!board) return res.status(404).json({ error: "Board not found" });

    await board.populate("workspace");
    const workspace = board.workspace;

    const userId = req.user._id?.toString();
    const isBoardMember = board.members.some(id => id.toString() === userId);
    const isBoardAdmin = board.admin?.toString() === userId;
    const isWorkspaceMember = workspace.members.some(id => id.toString() === userId);
    const isWorkspaceAdmin = workspace.createdBy?.toString() === userId;

    if (board.visibility === 'Workspace' && !isWorkspaceMember && !isWorkspaceAdmin && !isBoardMember && !isBoardAdmin) {
      return res.status(403).json({ error: "Access denied to this card" });
    }

    if (board.visibility === 'Private' && !isBoardMember && !isBoardAdmin && !isWorkspaceAdmin) {
      return res.status(403).json({ error: "Access denied to this card" });
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
    req.list = list;
    req.card = card;

    next();
  } catch (error) {
    console.log('Error in checkCardAccess- ',error);
    return res.status(500).json({error:'Internal server error.'});
  }
};

export default checkCardAccess;