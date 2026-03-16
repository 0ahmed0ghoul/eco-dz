import pool from "../db.js";
import path from "path";
import fs from "fs";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// ========================
// Get User Favorites
// ========================
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      'SELECT * FROM place_ratings WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json({ favorites: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get all reviews by the user
    const [reviews] = await pool.query(
      'SELECT * FROM place_reviews WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    if (reviews.length === 0) return res.json({ comments: [] });

    // 2. Get all images for these reviews
    const reviewIds = reviews.map((r) => r.id);
    const [images] = await pool.query(
      'SELECT * FROM place_review_images WHERE review_id IN (?)',
      [reviewIds]
    );

    // 3. Map images to each review
    const comments = reviews.map((review) => {
      const reviewImages = images
        .filter((img) => img.review_id === review.id)
        .map((img) => img.image); // or full path if needed

      return {
        ...review,
        images: reviewImages, // attach images array
      };
    });

    res.json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const updatePlaceReview = async (req, res) => {
  try {
    const { review, rating } = req.body;
    let deleteImages = req.body.deleteImages || [];
    const reviewId = req.params.id;
    const userId = req.user.id;

    // Normalize deleteImages to array
    if (!Array.isArray(deleteImages)) {
      deleteImages = [deleteImages];
    }

    // 1. Check ownership
    const [rows] = await pool.query(
      "SELECT id FROM place_reviews WHERE id = ? AND user_id = ?",
      [reviewId, userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Review not found" });
    }

    // 2. Delete images (BY FILENAME)
    if (deleteImages.length > 0) {
      // delete from filesystem
      deleteImages.forEach((filename) => {
        const filePath = path.join(
          process.cwd(),
          "uploads/reviews",
          filename
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      // delete from DB
      await pool.query(
        "DELETE FROM place_review_images WHERE review_id = ? AND image IN (?)",
        [reviewId, deleteImages]
      );
    }

    // 3. Add new images
    if (req.files && req.files.length > 0) {
      const insertImages = req.files.map((file) => [
        reviewId,
        file.filename,
      ]);

      await pool.query(
        "INSERT INTO place_review_images (review_id, image) VALUES ?",
        [insertImages]
      );
    }

    // 4. Update review text & rating
    await pool.query(
      "UPDATE place_reviews SET review = ?, rating = ? WHERE id = ?",
      [review, rating, reviewId]
    );

    res.json({ message: "Review updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getReviewReactions = async (req, res) => {
  const reviewId = req.params.reviewId;
  try {
    const [likes] = await pool.query(
      "SELECT COUNT(*) AS count FROM review_reactions WHERE review_id = ? AND type='like'",
      [reviewId]
    );
    const [dislikes] = await pool.query(
      "SELECT COUNT(*) AS count FROM review_reactions WHERE review_id = ? AND type='dislike'",
      [reviewId]
    );
    const [replies] = await pool.query(
      `SELECT rr.id, rr.text, rr.created_at, u.firstName, u.lastName, u.avatar
       FROM review_replies rr
       JOIN users u ON rr.user_id = u.id
       WHERE rr.review_id = ?
       ORDER BY rr.created_at ASC`,
      [reviewId]
    );

    res.json({
      likes: likes[0].count,
      dislikes: dislikes[0].count,
      replies: replies.map(r => ({
        id: r.id,
        text: r.text,
        created_at: r.created_at,
        user: `${r.firstName} ${r.lastName}`,
        avatar: r.avatar
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load reactions" });
  }
};
// POST /api/reviews/:reviewId/react
export const reactToReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const { type } = req.body; // 'like' | 'dislike'
  const userId = req.user.id;

  try {
    // 1️⃣ Check existing reaction
    const [[existing]] = await pool.query(
      `SELECT type FROM review_reactions
       WHERE review_id = ? AND user_id = ?`,
      [reviewId, userId]
    );

    if (existing) {
      // 2️⃣ Same reaction → REMOVE (undo)
      if (existing.type === type) {
        await pool.query(
          `DELETE FROM review_reactions
           WHERE review_id = ? AND user_id = ?`,
          [reviewId, userId]
        );
      } else {
        // 3️⃣ Different reaction → SWITCH
        await pool.query(
          `UPDATE review_reactions
           SET type = ?
           WHERE review_id = ? AND user_id = ?`,
          [type, reviewId, userId]
        );
      }
    } else {
      // 4️⃣ No reaction → INSERT
      await pool.query(
        `INSERT INTO review_reactions (review_id, user_id, type)
         VALUES (?, ?, ?)`,
        [reviewId, userId, type]
      );
    }

    // 5️⃣ Get updated counts
    const [[counts]] = await pool.query(
      `
      SELECT
        SUM(type = 'like') AS likes,
        SUM(type = 'dislike') AS dislikes
      FROM review_reactions
      WHERE review_id = ?
      `,
      [reviewId]
    );

    // 6️⃣ Get updated user reaction
    const [[userReaction]] = await pool.query(
      `
      SELECT type FROM review_reactions
      WHERE review_id = ? AND user_id = ?
      `,
      [reviewId, userId]
    );

    res.json({
      likes: counts.likes || 0,
      dislikes: counts.dislikes || 0,
      userReaction: userReaction?.type || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to react" });
  }
};



export const addReply = async (req, res) => {
  const reviewId = req.params.reviewId;
  const { text } = req.body;

  // Extract userId from the authenticated user in req.user
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      "INSERT INTO review_replies (review_id, user_id, text) VALUES (?, ?, ?)",
      [reviewId, userId, text]
    );

    // return the created reply
    const [rows] = await pool.query(
      `SELECT rr.id, rr.text, rr.created_at, u.firstName, u.lastName, u.avatar
       FROM review_replies rr
       JOIN users u ON rr.user_id = u.id
       WHERE rr.id = ?`,
      [result.insertId]
    );

    const r = rows[0];
    res.json({
      id: r.id,
      text: r.text,
      created_at: r.created_at,
      user: `${r.firstName} ${r.lastName}`,
      avatar: r.avatar
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add reply" });
  }
};

// ========================
// Get User Ratings
// ========================
export const getRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      'SELECT * FROM place_ratings WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json({ ratings: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Delete Favorite
// ========================
export const deleteFavorite = async (req, res) => {
  try {
    const { placeId } = req.body;
    const userId = req.user.id;

    await pool.query(
      'DELETE FROM place_ratings WHERE user_id = ? AND place_id = ?',
      [userId, placeId]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Delete Comment
// ========================
export const deleteReview= async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const [comment] = await pool.query(
      'SELECT * FROM place_reviews WHERE id = ? AND user_id = ?',
      [commentId, userId]
    );

    if (!comment.length)
      return res.status(404).json({ error: 'Comment not found or unauthorized' });

    await pool.query('DELETE FROM place_reviews WHERE id = ?', [commentId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Delete Rating
// ========================
export const deleteRating = async (req, res) => {
  try {
    const ratingId = req.params.id;
    const userId = req.user.id;

    const [rating] = await pool.query(
      'SELECT * FROM place_ratings WHERE id = ? AND user_id = ?',
      [ratingId, userId]
    );

    if (!rating.length)
      return res.status(404).json({ error: 'Rating not found or unauthorized' });

    await pool.query('DELETE FROM place_ratings WHERE id = ?', [ratingId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Get Place Details
// ========================
export const GetPlaceDetails = async (req, res) => {
  try {
    let { placeIds } = req.body;

    const cleanIds = [...new Set(placeIds)]
      .map(id => Number(id))
      .filter(id => !isNaN(id));

    if (cleanIds.length === 0) {
      return res.status(400).json({ error: 'Invalid place IDs' });
    }

    const [rows] = await pool.query(
      `SELECT id, name, location, image, category AS type, avg_rating, physical_rating, slug
       FROM places
       WHERE id IN (${cleanIds.map(() => '?').join(',')})`,
      cleanIds
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No places found' });
    }

    const placesObj = {};
    rows.forEach(place => {
      placesObj[place.id] = place;
    });

    res.json({ places: placesObj });
  } catch (error) {
    console.error('GetPlaceDetails error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========================
// Search Users
// ========================
export const searchForUser = async (req, res) => {
  const searchTerm = req.query.query;

  if (!searchTerm || searchTerm.trim() === "") {
    return res.json([]); // return empty array
  }

  try {
    const [rows] = await pool.query(
      `SELECT id, username
       FROM users
       WHERE username LIKE ?
       AND id != ?
       LIMIT 10`,
      [`%${searchTerm}%`, req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to search users" });
  }
};



export const updateUserProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const userId = req.user.id;
    const filename = req.file.filename;

    // 1️⃣ Get current user avatar
    const [users] = await pool.query(
      "SELECT avatar FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const oldAvatar = users[0].avatar;

    // 2️⃣ Delete old avatar if exists
    if (oldAvatar) {
      const oldPath = path.join("uploads", "avatars", oldAvatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // 3️⃣ Update avatar in database
    await pool.query(
      "UPDATE users SET avatar = ? WHERE id = ?",
      [filename, userId]
    );

    res.json({
      message: "Profile picture updated",
      avatar: filename,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};



export const cleamAchievement = async (req,res) =>{
}




export const sendFollowConfirmationEmail = async (req, res) => {
  let connection;

  try {
    console.log('📨 sendFollowConfirmationEmail HIT');

    // ✅ Authenticated user (from JWT middleware)
    const userId = req.user.id;

    const { agencyId, notificationPrefs = {} } = req.body;

    if (!agencyId) {
      return res.status(400).json({
        success: false,
        error: 'Agency ID is required',
      });
    }

    connection = await pool.getConnection();

    /* =======================
       1️⃣ Get user
    ======================= */
    const [users] = await connection.query(
      `SELECT id, email, username, firstName, lastName
       FROM users
       WHERE id = ?`,
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const user = users[0];

    /* =======================
       2️⃣ Get agency
    ======================= */
    const [agencies] = await connection.query(
      `SELECT id, username, firstName, lastName, email, address, description
       FROM users
       WHERE id = ? AND role = 'travel_agency'`,
      [agencyId]
    );

    if (!agencies.length) {
      return res.status(404).json({
        success: false,
        error: 'Travel agency not found',
      });
    }

    const agency = agencies[0];

    /* =======================
       3️⃣ Save follow (OPTIMISTIC)
    ======================= */
    await connection.query(`
      CREATE TABLE IF NOT EXISTS follows (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        agencyId INT NOT NULL,
        notification_trips BOOLEAN DEFAULT TRUE,
        notification_deals BOOLEAN DEFAULT TRUE,
        notification_updates BOOLEAN DEFAULT TRUE,
        followedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_follow (userId, agencyId)
      )
    `);

    await connection.query(
      `
      INSERT INTO follows (userId, agencyId, notification_trips, notification_deals, notification_updates)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        notification_trips = VALUES(notification_trips),
        notification_deals = VALUES(notification_deals),
        notification_updates = VALUES(notification_updates),
        followedAt = CURRENT_TIMESTAMP
      `,
      [
        userId,
        agencyId,
        notificationPrefs.trips ?? true,
        notificationPrefs.deals ?? true,
        notificationPrefs.updates ?? true,
      ]
    );

    console.log(`✅ Follow saved: user ${userId} → agency ${agencyId}`);

    /* =======================
       4️⃣ Email templates
    ======================= */
    const html = `
      <h2>You're now following ${agency.username}</h2>
      <p>Hello ${user.firstName || user.username},</p>
      <p>You’ll receive updates about:</p>
      <ul>
        <li>${notificationPrefs.trips ? '✓' : '✗'} New trips</li>
        <li>${notificationPrefs.deals ? '✓' : '✗'} Deals & offers</li>
        <li>${notificationPrefs.updates ? '✓' : '✗'} Agency updates</li>
      </ul>
      <p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/agency/${agencyId}">
          View agency profile
        </a>
      </p>
    `;

    const mailOptions = {
      from: `"Adventure Platform" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `You're now following ${agency.username}`,
      html,
    };

    console.log('📤 Sending email to:', user.email);

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent:', info.messageId);

    return res.status(200).json({
      success: true,
      message: 'Follow confirmation email sent',
      emailId: info.messageId,
    });

  } catch (err) {
    console.error('❌ Follow email failed:', err);

    return res.status(500).json({
      success: false,
      error: 'Failed to send follow confirmation email',
    });
  } finally {
    if (connection) connection.release();
  }
};


// Get follow status
export const getFollowStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { agencyId } = req.params;
    
    const [follows] = await pool.query(
      `SELECT * FROM follows WHERE userId = ? AND agencyId = ?`,
      [userId, agencyId]
    );
    
    const isFollowing = follows.length > 0;
    
    res.status(200).json({
      success: true,
      isFollowing,
      followRecord: isFollowing ? follows[0] : null
    });
    
  } catch (error) {
    console.error('Error getting follow status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get follow status'
    });
  }
};

// Unfollow agency
export const unfollowAgency = async (req, res) => {
  try {
    const userId = req.user.id;
    const { agencyId } = req.params;
    
    const [result] = await pool.query(
      `DELETE FROM follows WHERE userId = ? AND agencyId = ?`,
      [userId, agencyId]
    );
    
    res.status(200).json({
      success: true,
      message: 'Successfully unfollowed agency',
      affectedRows: result.affectedRows
    });
    
  } catch (error) {
    console.error('Error unfollowing agency:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unfollow agency'
    });
  }
};



// Helper function to save follow record
const saveFollowRecord = async (userId, agencyId, notificationPrefs) => {
  try {
    // Check if Follow model exists or create one
    let Follow;
    try {
      Follow = (await import('../models/Follow.js')).default;
    } catch {
      // If Follow model doesn't exist, create a basic schema
      const mongoose = await import('mongoose');
      const followSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        notificationPrefs: {
          trips: { type: Boolean, default: true },
          deals: { type: Boolean, default: true },
          updates: { type: Boolean, default: true }
        },
        followedAt: { type: Date, default: Date.now }
      });

      followSchema.index({ userId: 1, agencyId: 1 }, { unique: true });
      Follow = mongoose.model('Follow') || mongoose.model('Follow', followSchema);
    }

    // Save or update follow record
    await Follow.findOneAndUpdate(
      { userId, agencyId },
      {
        userId,
        agencyId,
        notificationPrefs,
        followedAt: new Date()
      },
      { upsert: true, new: true }
    );

    console.log(`Follow record saved for user ${userId} following agency ${agencyId}`);
    
  } catch (dbError) {
    console.error('Error saving follow record:', dbError);
    // Don't throw error - email was sent successfully
  }
};

// Test email endpoint
export const testEmail = async (req, res) => {
  try {
    const testMailOptions = {
      from: {
        name: 'Adventure Platform Test',
        address: process.env.EMAIL_FROM_ADDRESS
      },
      to: process.env.TEST_EMAIL || req.user.email,
      subject: 'Test Email from Adventure Platform',
      text: 'This is a test email to verify email configuration.',
      html: '<h1>Test Email</h1><p>This is a test email to verify email configuration.</p>'
    };

    const info = await transporter.sendMail(testMailOptions);
    
    res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      emailId: info.messageId
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email'
    });
  }
};

// Get email status endpoint
export const getEmailStatus = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      emailConfigured: !!process.env.EMAIL_USER,
      emailHost: process.env.EMAIL_HOST,
      emailFrom: process.env.EMAIL_FROM_ADDRESS,
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get email status'
    });
  }
};