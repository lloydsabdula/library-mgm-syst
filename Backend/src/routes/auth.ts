import { Router } from 'express';
import { db } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const SALT_ROUNDS = 10;

// Signup
router.post('/signup', async (req, res) => {
  const { username, password, email, role } = req.body;

  if (!username || !password || !email || !role) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if ((existing as any).length > 0) return res.status(400).json({ message: 'Username or email exists' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await db.query(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, hashed, email, role]
    );

    res.json({ message: 'User created', userId: (result as any).insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = (rows as any)[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    let valid = false;

    // Check if password is hashed
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      // Compare with bcrypt
      valid = await bcrypt.compare(password, user.password);
    } else {
      // Compare plain-text passwords
      valid = user.password === password;

      // If correct, hash the password and update the database
      if (valid) {
        const hashed = await bcrypt.hash(password, 10);
        await db.query('UPDATE users SET password = ? WHERE user_id = ?', [hashed, user.user_id]);
        console.log(`Hashed password for user_id ${user.user_id}`);
      }
    }

    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

export default router;
