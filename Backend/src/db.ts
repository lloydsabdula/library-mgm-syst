import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const testConnection = async () => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log('Database connected:', rows);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};
