import dotenv from "dotenv";
import { createPool } from "mysql2/promise";

dotenv.config();

// Log what we're using (helpful for debugging on Render)
console.log("🚀 Connecting to Railway MySQL from Render:");
console.log(`📌 Host: ${process.env.DB_HOST}`);
console.log(`📌 Port: ${process.env.DB_PORT}`);
console.log(`📌 Database: ${process.env.DB_NAME}`);
console.log(`📌 User: ${process.env.DB_USER}`);

const pool = createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,  // ← THIS IS CRUCIAL
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 second timeout
});

// 🔍 Test database connection
const testConnection = async () => {
  try {
    console.log("🔄 Attempting database connection...");
    
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    
    // Simple test query
    const [rows] = await connection.query("SELECT NOW() as time");
    console.log("🕐 Server time:", rows[0].time);
    
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    
    if (error.code === 'ETIMEDOUT') {
      console.error("\n🔍 DEBUGGING INFO:");
      console.error(`   Host: ${process.env.DB_HOST}`);
      console.error(`   Port: ${process.env.DB_PORT}`);
      console.error("   Make sure these match your Railway public network exactly");
    }
  }
};

// Run the test
testConnection();

export default pool;