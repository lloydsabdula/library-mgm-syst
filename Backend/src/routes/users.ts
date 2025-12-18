import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware } from '../middleware/authMiddleware';
import { allowRoles } from '../utils/roleHelpers';

const router = Router();

// ------------------ GET all students (admin only) ------------------
router.get('/', authMiddleware, allowRoles('admin'), async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      'SELECT u.user_id, u.username, u.email, u.phone_number, s.first_name, s.last_name, s.lrn, s.course, s.section FROM users u JOIN students s ON u.user_id = s.user_id WHERE u.role="students" AND u.is_deleted = 0'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Error fetching students', error: (err as Error).message });
  }
});

// ------------------ GET single student (admin or self) ------------------
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  const userIdNum = parseInt(req.params.id, 10);

  if (isNaN(userIdNum)) return res.status(400).json({ message: 'Invalid user ID' });

  if (req.user!.role !== 'admin' && req.user!.userId !== userIdNum) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [rows] = await db.query(
      'SELECT u.user_id, u.username, u.email, u.phone_number, s.first_name, s.last_name, s.lrn, s.course, s.section FROM users u JOIN students s ON u.user_id = s.user_id WHERE u.user_id = ? AND u.is_deleted = 0',
      [userIdNum]
    );
    res.json((rows as any)[0] || null);
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ message: 'Error fetching student', error: (err as Error).message });
  }
});

// ------------------ UPDATE student info (self only) ------------------
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const userIdNum = parseInt(req.params.id, 10);

  if (isNaN(userIdNum)) return res.status(400).json({ message: 'Invalid user ID' });

  if (req.user!.userId !== userIdNum) return res.status(403).json({ message: 'Access denied' });

  const updates = { ...req.body };

  // Separate fields for users vs students table
  const userUpdates: any = {};
  const studentUpdates: any = {};

  const userFields = ['username', 'email', 'phone_number'];
  const studentFields = ['first_name', 'last_name', 'lrn', 'course', 'section', 'favorite_genre', 'monthly_reading_goal'];

  for (const key of Object.keys(updates)) {
    if (userFields.includes(key)) userUpdates[key] = updates[key];
    if (studentFields.includes(key)) studentUpdates[key] = updates[key];
  }

  if (Object.keys(userUpdates).length === 0 && Object.keys(studentUpdates).length === 0) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }

  try {
    console.log('Updating user:', userIdNum, 'users table:', userUpdates, 'students table:', studentUpdates);

    if (Object.keys(userUpdates).length > 0) {
      await db.query('UPDATE users SET ? WHERE user_id = ?', [userUpdates, userIdNum]);
    }

    if (Object.keys(studentUpdates).length > 0) {
      await db.query('UPDATE students SET ? WHERE user_id = ?', [studentUpdates, userIdNum]);
    }

    res.json({ message: 'Student updated' });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ message: 'Error updating student', error: (err as Error).message });
  }
});

// ------------------ Soft delete self (student) ------------------
router.post('/delete-me', authMiddleware, allowRoles('students'), async (req: Request, res: Response) => {
  try {
    console.log('Soft deleting user:', req.user!.userId);
    await db.query(
      'UPDATE users SET is_deleted = 1, deletion_date = CURDATE() WHERE user_id = ?',
      [req.user!.userId]
    );
    res.json({ message: 'Account scheduled for deletion in 30 days' });
  } catch (err) {
    console.error('Failed to schedule account deletion:', err);
    res.status(500).json({ message: 'Failed to schedule account deletion', error: (err as Error).message });
  }
});

// ------------------ Restore account (admin or self) ------------------
router.post('/restore/:id', authMiddleware, async (req: Request, res: Response) => {
  const userIdNum = parseInt(req.params.id, 10);

  if (isNaN(userIdNum)) return res.status(400).json({ message: 'Invalid user ID' });

  if (req.user!.role !== 'admin' && req.user!.userId !== userIdNum) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    console.log('Restoring user:', userIdNum);
    await db.query('UPDATE users SET is_deleted = 0, deletion_date = NULL WHERE user_id = ?', [userIdNum]);
    res.json({ message: 'Account restored' });
  } catch (err) {
    console.error('Failed to restore account:', err);
    res.status(500).json({ message: 'Failed to restore account', error: (err as Error).message });
  }
});

// ------------------ List pending deletions (admin only) ------------------
router.get('/pending-deletion/all', authMiddleware, allowRoles('admin'), async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE is_deleted = 1');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching pending deletions:', err);
    res.status(500).json({ message: 'Error fetching pending deletions', error: (err as Error).message });
  }
});

// ------------------ Scheduled permanent deletion ------------------
export const deleteOldAccounts = async () => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const [result] = await db.query(
      'DELETE FROM users WHERE is_deleted = 1 AND deletion_date <= DATE_SUB(?, INTERVAL 30 DAY)',
      [today]
    );
    console.log('Deleted old accounts:', (result as any).affectedRows);
  } catch (err) {
    console.error('Error deleting old accounts:', err);
  }
};

export default router;

