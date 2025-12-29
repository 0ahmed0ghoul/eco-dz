-- Conversations table for direct messaging
CREATE TABLE IF NOT EXISTS conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_conversation (user1_id, user2_id),
  INDEX idx_user1 (user1_id),
  INDEX idx_user2 (user2_id)
);

-- Messages table for direct messages
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  message_text LONGTEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  INDEX idx_conversation (conversation_id),
  INDEX idx_sender (sender_id),
  INDEX idx_created (created_at)
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  category VARCHAR(50), -- 'booking', 'destination', 'general', 'complaint'
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);

-- Support messages table
CREATE TABLE IF NOT EXISTS support_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  sender_id INT NOT NULL,
  message_text LONGTEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
  INDEX idx_ticket (ticket_id),
  INDEX idx_sender (sender_id),
  INDEX idx_created (created_at)
);
