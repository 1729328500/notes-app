import poll from "../config/db";

//创建笔记
export const createNote = async (req, res) => {
  try {
    const { userId, title, content, categoryId, tags } = req.body;
    const [result] = await poll.query(
      "INSERT INTO notes (userId,title,content,categoryId,tags) VALUES (?,?,?,?,?)",
      [userId, title, content, categoryId, JSON.stringify(tags)]
    );
    res.status(201).json({
      id: result.insertId,
      userId,
      title,
      content,
      categoryId,
      tags,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
