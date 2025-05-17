import pool from "../config/db.js";

// 收藏笔记
export const favoriteNote = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const { userId } = req.body;

    // 检查是否已经收藏
    const [existing] = await pool.query(
      "SELECT * FROM favorites WHERE user_id = ? AND note_id = ?",
      [userId, noteId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Note already favorited" });
    }

    // 添加收藏记录并更新笔记的collection状态
    await pool.query("INSERT INTO favorites (user_id, note_id) VALUES (?, ?)", [
      userId,
      noteId,
    ]);

    // 更新笔记的collection字段为1
    await pool.query("UPDATE notes SET collection = 1 WHERE id = ?", [noteId]);

    res.status(201).json({ message: "Note favorited successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 取消收藏笔记
export const unfavoriteNote = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const { userId } = req.body;

    const [result] = await pool.query(
      "DELETE FROM favorites WHERE user_id = ? AND note_id = ?",
      [userId, noteId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    // 更新笔记的collection字段为0
    await pool.query("UPDATE notes SET collection = 0 WHERE id = ?", [noteId]);

    res.status(200).json({ message: "Note unfavorited successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取用户收藏的笔记列表
export const getFavoriteNotes = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(
      `SELECT n.* 
       FROM notes n
       INNER JOIN favorites f ON n.id = f.note_id
       WHERE f.user_id = ?`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
