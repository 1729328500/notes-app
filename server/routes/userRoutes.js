import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  updateNickname,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.put("/:id/nickname", updateNickname);

export default router;
