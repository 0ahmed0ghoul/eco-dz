import {
  getComments as getCommentsData,
  saveComments,
  getCommentReplies,
  saveCommentReplies,
  getCommentLikes,
  saveCommentLikes,
  getReplyLikes,
  saveReplyLikes,
  generateId
} from "../data/fileHelpers.js";

// Get comments for a specific destination
export const getComments = async (req, res) => {
  const { type, id } = req.query;
  const userId = req.query.userId || null;

  try {
    const comments = await getCommentsData();
    const replies = await getCommentReplies();
    const likes = await getCommentLikes();

    // Filter comments for this destination
    const destinationComments = comments.filter(
      (c) => c.comment_type === type && c.destination_id === id
    );

    // Enrich comments with replies and like info
    const enrichedComments = destinationComments.map((comment) => {
      const commentReplies = replies.filter((r) => r.comment_id === comment.id);
      const likeCount = likes.filter((l) => l.comment_id === comment.id).length;
      const userLiked = userId
        ? likes.some((l) => l.comment_id === comment.id && l.user_id === userId)
        : false;

      return {
        ...comment,
        likes: likeCount,
        userLiked,
        replies: commentReplies
      };
    });

    res.json(enrichedComments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};

// Create a new comment (auth optional - guests allowed)
export const createComment = async (req, res) => {
  const { type, destination_id, rating, comment_text, user_name, user_email, user_id } = req.body;
  
  // Get user info from auth if logged in, otherwise use provided info
  const authUser = req.user;
  const finalUserId = authUser?.id || user_id || `guest_${Date.now()}`;
  const finalUserName = authUser?.name || user_name || "Guest";
  const finalUserEmail = authUser?.email || user_email || "guest@example.com";

  try {
    const comments = await getCommentsData();

    const newComment = {
      id: generateId(),
      comment_type: type,
      destination_id,
      user_id: finalUserId,
      user_name: finalUserName,
      user_email: finalUserEmail,
      rating,
      comment_text,
      created_at: new Date().toISOString(),
      updated_at: null
    };

    comments.push(newComment);
    await saveComments(comments);

    res.status(201).json({
      ...newComment,
      likes: 0,
      userLiked: false,
      replies: []
    });
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
    const commentReplies = await getCommentReplies();

    const newReply = {
      id: generateId(),
      comment_id,
      user_id,
      user_name,
      user_email,
      reply_text,
      created_at: new Date().toISOString(),
      updated_at: null
    };

    commentReplies.push(newReply);
    await saveCommentReplies(commentReplies);

    res.status(201).json({
      ...newReply,
      likes: 0,
      userLiked: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating reply", error: error.message });
  }
};

// Like a comment (auth required)
export const likeComment = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const likes = await getCommentLikes();

    // Check if user already liked
    const existingLikeIndex = likes.findIndex(
      (l) => l.comment_id === id && l.user_id === user_id
    );

    if (existingLikeIndex > -1) {
      // Already liked, so unlike
      likes.splice(existingLikeIndex, 1);
      await saveCommentLikes(likes);
      res.json({ message: "Comment unliked", liked: false });
    } else {
      // Not liked, so like
      likes.push({
        id: generateId(),
        comment_id: id,
        user_id
      });
      await saveCommentLikes(likes);
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
    const likes = await getReplyLikes();

    // Check if user already liked
    const existingLikeIndex = likes.findIndex(
      (l) => l.reply_id === id && l.user_id === user_id
    );

    if (existingLikeIndex > -1) {
      // Already liked, so unlike
      likes.splice(existingLikeIndex, 1);
      await saveReplyLikes(likes);
      res.json({ message: "Reply unliked", liked: false });
    } else {
      // Not liked, so like
      likes.push({
        id: generateId(),
        reply_id: id,
        user_id
      });
      await saveReplyLikes(likes);
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
    const comments = await getCommentsData();
    const comment = comments.find((c) => c.id === id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.rating = rating;
    comment.comment_text = comment_text;
    comment.updated_at = new Date().toISOString();

    await saveComments(comments);

    res.json({ message: "Comment updated successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
};

// Update a reply (auth required)
export const updateReply = async (req, res) => {
  const { id } = req.params;
  const { reply_text } = req.body;

  try {
    const replies = await getCommentReplies();
    const reply = replies.find((r) => r.id === id);

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    reply.reply_text = reply_text;
    reply.updated_at = new Date().toISOString();

    await saveCommentReplies(replies);

    res.json({ message: "Reply updated successfully", reply });
  } catch (error) {
    res.status(500).json({ message: "Error updating reply", error: error.message });
  }
};

// Delete a comment (auth required)
export const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await getCommentsData();
    const commentIndex = comments.findIndex((c) => c.id === id);

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comments.splice(commentIndex, 1);
    await saveComments(comments);

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};

// Delete a reply (auth required)
export const deleteReply = async (req, res) => {
  const { id } = req.params;

  try {
    const replies = await getCommentReplies();
    const replyIndex = replies.findIndex((r) => r.id === id);

    if (replyIndex === -1) {
      return res.status(404).json({ message: "Reply not found" });
    }

    replies.splice(replyIndex, 1);
    await saveCommentReplies(replies);

    res.json({ message: "Reply deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reply", error: error.message });
  }
};
