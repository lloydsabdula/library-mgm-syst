import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

const allowRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: Function) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// STUDENT pays a penalty
router.post('/pay/:penaltyId', authMiddleware, allowRoles('students'), async (req: Request, res: Response) => {
  const studentId = req.user!.userId;
  const { penaltyId } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM penalty WHERE penalty_id = ? AND student_id = ?', [penaltyId, studentId]);
    const penalty = (rows as any)[0];
    if (!penalty) return res.status(404).json({ message: 'Penalty not found' });
    if (penalty.date_paid) return res.status(400).json({ message: 'Penalty already paid' });

    await db.query('UPDATE penalty SET date_paid = CURDATE() WHERE penalty_id = ?', [penaltyId]);

    res.json({ message: 'Penalty paid successfully' });
  } catch (err) {
    console.error('Pay penalty error:', err);
    res.status(500).json({ message: 'Failed to pay penalty' });
  }
});

// STUDENT views own penalties
router.get('/my', authMiddleware, allowRoles('students'), async (req: Request, res: Response) => {
  const studentId = req.user!.userId;

  try {
    const [rows] = await db.query('SELECT * FROM penalty WHERE student_id = ?', [studentId]);
    res.json(rows);
  } catch (err) {
    console.error('View penalties error:', err);
    res.status(500).json({ message: 'Failed to fetch penalties' });
  }
});

// STAFF/ADMIN views all penalties
router.get('/all', authMiddleware, allowRoles('staff', 'admin'), async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      'SELECT p.*, s.first_name AS student_first, s.last_name AS student_last FROM penalty p JOIN students s ON p.student_id = s.student_id'
    );
    res.json(rows);
  } catch (err) {
    console.error('View all penalties error:', err);
    res.status(500).json({ message: 'Failed to fetch penalties' });
  }
});

export default router;
