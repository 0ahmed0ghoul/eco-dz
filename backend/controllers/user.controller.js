import pool from "../db.js";


export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({ favorites: rows }); // only send rows
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      'SELECT * FROM place_comments WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({ comments: rows }); // only send rows
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRatings = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      'SELECT * FROM place_ratings WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({ ratings: rows }); // only send rows
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteFavorite = async (req, res) => {
   try {
      const { placeId } = req.body;
      const userId = req.user.id;
      
      await pool.query(
        'DELETE FROM favorites WHERE user_id = ? AND place_id = ?',
        [userId, placeId]
      );
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

export const deleteComment = async (req, res) => {
   try {
      const commentId = req.params.id;
      const userId = req.user.id;
      
      // Verify ownership
      const comment = await pool.query(
        'SELECT * FROM place_comments WHERE id = ? AND user_id = ?',
        [commentId, userId]
      );
      
      if (!comment.length) {
        return res.status(404).json({ error: 'Comment not found or unauthorized' });
      }
      
      await pool.query('DELETE FROM place_comments WHERE id = ?', [commentId]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}



export const deleteRating = async (req, res) => {
  try {
    const ratingId = req.params.id;
    const userId = req.user.id;
    
    // Verify ownership
    const rating = await pool.query(
      'SELECT * FROM place_ratings WHERE id = ? AND user_id = ?',
      [ratingId, userId]
    );
    
    if (!rating.length) {
      return res.status(404).json({ error: 'Rating not found or unauthorized' });
    }
    
    await pool.query('DELETE FROM place_ratings WHERE id = ?', [ratingId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const GetPlaceDetails = async (req, res) => {
  try {
    let { placeIds } = req.body;

    // Convert to numbers + remove duplicates
    const cleanIds = [...new Set(placeIds)]
      .map(id => Number(id))
      .filter(id => !isNaN(id));

    if (cleanIds.length === 0) {
      return res.status(400).json({ error: 'Invalid place IDs' });
    }

    const [rows] = await pool.query(
      `SELECT 
         id,
         name,
         location,
         image,
         category AS type,
         avg_rating,
         physical_rating,
         slug
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






export const becomeOrganizer = async (req, res) => {
  const { organization_name, phone, description } = req.body;

  await pool.query(
    `INSERT INTO organizer_profiles (user_id, organization_name, phone, description)
     VALUES (?, ?, ?, ?)`,
    [req.user.id, organization_name, phone, description]
  );

  await pool.query(
    `INSERT IGNORE INTO user_roles (user_id, role_id)
     VALUES (?, (SELECT id FROM roles WHERE name='organizer'))`,
    [req.user.id]
  );

  res.json({ message: "Organizer role added" });
};
