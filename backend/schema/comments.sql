-- Comments table for all destinations (places, eco-tours, accommodations, etc)
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comment_type VARCHAR(50) NOT NULL, -- 'place', 'eco-tour', 'accommodation', 'transport', etc
  destination_id INT NOT NULL,
  user_id INT NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  user_email VARCHAR(100) NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment_text LONGTEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_type_destination (comment_type, destination_id),
  INDEX idx_user (user_id),
  INDEX idx_created (created_at)
);

-- Replies table for comment replies
CREATE TABLE IF NOT EXISTS comment_replies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comment_id INT NOT NULL,
  user_id INT NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  user_email VARCHAR(100) NOT NULL,
  reply_text LONGTEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  INDEX idx_comment (comment_id),
  INDEX idx_user (user_id),
  INDEX idx_created (created_at)
);

-- Table to track who liked what comment
CREATE TABLE IF NOT EXISTS comment_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comment_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_comment_user (comment_id, user_id),
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
);

-- Table to track who liked what reply
CREATE TABLE IF NOT EXISTS reply_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reply_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_reply_user (reply_id, user_id),
  FOREIGN KEY (reply_id) REFERENCES comment_replies(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
);
