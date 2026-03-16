import pool from "../db.js";

// Get comments for a specific destination
export const getComments = async (req, res) => {
  const { type, id } = req.query;
  const userId = req.query.userId || null;

  try {
    const [comments] = await pool.query(
      "SELECT * FROM comments WHERE comment_type = ? AND destination_id = ? ORDER BY created_at DESC",
      [type, id]
    );

    // Fetch replies and like info for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const [replies] = await pool.query(
          "SELECT * FROM comment_replies WHERE comment_id = ? ORDER BY created_at ASC",
          [comment.id]
        );

        // Check if current user liked this comment
        let userLiked = false;
        if (userId) {
          const [likeCheck] = await pool.query(
            "SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?",
            [comment.id, userId]
          );
          userLiked = likeCheck.length > 0;
        }

        // Get like count
        const [likeCount] = await pool.query(
          "SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = ?",
          [comment.id]
        );

        return { 
          ...comment, 
          likes: likeCount[0].count,
          userLiked,
          replies: replies.map(reply => ({
            ...reply,
            userLiked: false
          }))
        };
      })
    );

    res.json(commentsWithReplies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};

// Create a new comment (auth required)
export const createComment = async (req, res) => {
  const { type, destination_id, rating, comment_text } = req.body;
  const { id: user_id, name: user_name, email: user_email } = req.user;

  try {
    const [result] = await pool.query(
      "INSERT INTO comments (comment_type, destination_id, user_id, user_name, user_email, rating, comment_text, created_at, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [type, destination_id, user_id, user_name, user_email, rating, comment_text, new Date().toISOString(), 0]
    );

    const newComment = {
      id: result.insertId,
      type,
      destination_id,
      user_id,
      user_name,
      user_email,
      rating,
      comment_text,
      created_at: new Date().toISOString(),
      likes: 0,
      userLiked: false,
      replies: []
    };

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Error creating comment", error: error.message });
  }
};

// Create a reply to a comment (auth required)
export const createReply = async (req, res) => {
  const { id: comment_id } = req.params;
  const { reply_text } = req.body;
  const { id: user_id, name: user_name, email: user_email } = req.user;

  try {
    const [result] = await pool.query(
      "INSERT INTO comment_replies (comment_id, user_id, user_name, user_email, reply_text, likes) VALUES (?, ?, ?, ?, ?, ?)",
      [comment_id, user_id, user_name, user_email, reply_text, 0]
    );

    const newReply = {
      id: result.insertId,
      comment_id,
      user_id,
      user_name,
      user_email,
      reply_text,
      likes: 0,
      userLiked: false,
      created_at: new Date().toISOString()
    };

    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ message: "Error creating reply", error: error.message });
  }
};

// Like a comment (auth required)
export const likeComment = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    // Check if user already liked
    const [existingLike] = await pool.query(
      "SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?",
      [id, user_id]
    );

    if (existingLike.length > 0) {
      // Already liked, so unlike
      await pool.query(
        "DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?",
        [id, user_id]
      );
      res.json({ message: "Comment unliked", liked: false });
    } else {
      // Not liked, so like
      await pool.query(
        "INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)",
        [id, user_id]
      );
      res.json({ message: "Comment liked", liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Error liking comment", error: error.message });
  }
};

// Like a reply (auth required)
export const likeReply = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    // Check if user already liked
    const [existingLike] = await pool.query(
      "SELECT id FROM reply_likes WHERE reply_id = ? AND user_id = ?",
      [id, user_id]
    );

    if (existingLike.length > 0) {
      // Already liked, so unlike
      await pool.query(
        "DELETE FROM reply_likes WHERE reply_id = ? AND user_id = ?",
        [id, user_id]
      );
      res.json({ message: "Reply unliked", liked: false });
    } else {
      // Not liked, so like
      await pool.query(
        "INSERT INTO reply_likes (reply_id, user_id) VALUES (?, ?)",
        [id, user_id]
      );
      res.json({ message: "Reply liked", liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Error liking reply", error: error.message });
  }
};

// Update a comment (auth required)
export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { rating, comment_text } = req.body;

  try {
    await pool.query(
      "UPDATE comments SET rating = ?, comment_text = ?, updated_at = NOW() WHERE id = ?",
      [rating, comment_text, id]
    );

    res.json({ message: "Comment updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
};

// Update a reply (auth required)
export const updateReply = async (req, res) => {
  const { id } = req.params;
  const { reply_text } = req.body;

  try {
    await pool.query(
      "UPDATE comment_replies SET reply_text = ?, updated_at = NOW() WHERE id = ?",
      [reply_text, id]
    );

    res.json({ message: "Reply updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating reply", error: error.message });
  }
};

// Delete a comment (auth required)
export const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM comments WHERE id = ?", [id]);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};

// Delete a reply (auth required)
export const deleteReply = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM comment_replies WHERE id = ?", [id]);
    res.json({ message: "Reply deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reply", error: error.message });
  }
};
