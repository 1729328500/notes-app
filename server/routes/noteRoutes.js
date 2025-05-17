import express from "express";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  getNotesByCategory,
  searchNotesByTags,
} from "../controllers/noteController.js";
import {
  favoriteNote,
  unfavoriteNote,
  getFavoriteNotes,
} from "../controllers/favoriteController.js";

const router = express.Router();

router.post("/", createNote);
router.get("/user/:userId", getNotes);
router.get("/:id", getNote);
router.get("/categories/:userId/:categoryId", getNotesByCategory);
router.get("/search/:userId", searchNotesByTags);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

// 收藏相关路由
router.post("/:id/favorite", favoriteNote);
router.delete("/:id/favorite", unfavoriteNote);
router.get("/favorites/:userId", getFavoriteNotes);

export default router;
