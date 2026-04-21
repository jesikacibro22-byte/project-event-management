const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  try {
    // Koneksi tanpa database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'pass123'
    });
    
    // Buat database
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'user_auth_db'}`);
    console.log(`Database '${process.env.DB_NAME || 'user_auth_db'}' created or already exists`);
    
    await connection.end();
    console.log('Setup complete! Now run: npm run dev');
    
  } catch (error) {
    console.error('Setup failed:', error.message);
  }
}

setupDatabase();