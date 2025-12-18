import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Role-based access helper
const allowRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: Function) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// GET all active books → accessible by all logged-in users
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books WHERE is_deleted = 0');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

// POST new book → staff and admin only
router.post('/', authMiddleware, allowRoles('staff', 'admin'), async (req, res) => {
  const { title, author, isbn, pages, available_copies, publisher, publication_year, description, genre } = req.body;

  if (!title || !available_copies) {
    return res.status(400).json({ message: 'Title and available_copies are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO books (title, author, isbn, pages, available_copies, publisher, publication_year, description, genre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, author, isbn, pages, available_copies, publisher, publication_year, description, genre]
    );
    res.json({ message: 'Book added', bookId: (result as any).insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding book' });
  }
});

// PUT update book → staff and admin only
router.put('/:id', authMiddleware, allowRoles('staff', 'admin'), async (req, res) => {
  const bookId = req.params.id;
  const updates = req.body;

  try {
    await db.query('UPDATE books SET ? WHERE book_id = ?', [updates, bookId]);
    res.json({ message: 'Book updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating book' });
  }
});

// Soft delete → move to recycle bin (staff/admin)
router.delete('/:id', authMiddleware, allowRoles('staff', 'admin'), async (req, res) => {
  const bookId = req.params.id;

  try {
    await db.query('UPDATE books SET is_deleted = 1 WHERE book_id = ?', [bookId]);
    res.json({ message: 'Book moved to recycle bin' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error moving book to recycle bin' });
  }
});

// GET books in recycle bin → admin only
router.get('/recycle-bin', authMiddleware, allowRoles('admin'), async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books WHERE is_deleted = 1');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recycle bin books' });
  }
});

// Permanently delete → admin only
router.delete('/archive/:id', authMiddleware, allowRoles('admin'), async (req, res) => {
  const bookId = req.params.id;

  try {
    await db.query('DELETE FROM books WHERE book_id = ?', [bookId]);
    res.json({ message: 'Book permanently deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting book permanently' });
  }
});

// Optional: restore book from recycle bin → admin only
router.post('/restore/:id', authMiddleware, allowRoles('admin'), async (req, res) => {
  const bookId = req.params.id;

  try {
    await db.query('UPDATE books SET is_deleted = 0 WHERE book_id = ?', [bookId]);
    res.json({ message: 'Book restored from recycle bin' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error restoring book' });
  }
});

export default router;
