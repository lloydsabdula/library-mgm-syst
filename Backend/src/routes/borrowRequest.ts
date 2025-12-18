import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware } from '../middleware/authMiddleware';
import { allowRoles } from '../utils/roleHelpers';

const router = Router();

// ---------------- Role-based access helpers ----------------
const studentOnly = allowRoles('students');
const staffAdmin = allowRoles('staff', 'admin');
const adminOnly = allowRoles('admin');

// ---------------- Student Endpoints ----------------

// Create a borrow request
router.post('/', authMiddleware, studentOnly, async (req: Request, res: Response) => {
  const studentId = req.user!.userId;
  const { book_id } = req.body;

  try {
    const [existing] = await db.query(
      'SELECT * FROM borrow_requests WHERE student_id = ? AND book_id = ? AND status = "pending"',
      [studentId, book_id]
    );
    if ((existing as any).length > 0) return res.status(400).json({ message: 'You already have a pending request for this book' });

    const [result] = await db.query(
      'INSERT INTO borrow_requests (student_id, book_id) VALUES (?, ?)',
      [studentId, book_id]
    );

    res.json({ message: 'Request submitted', requestId: (result as any).insertId });
  } catch (err) {
    console.error('Create request error:', err);
    res.status(500).json({ message: 'Failed to submit request', error: err });
  }
});

// Edit pending borrow request
router.put('/:id', authMiddleware, studentOnly, async (req: Request, res: Response) => {
  const studentId = req.user!.userId;
  const requestId = req.params.id;
  const { book_id } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM borrow_requests WHERE request_id = ? AND student_id = ? AND status = "pending"',
      [requestId, studentId]
    );
    if ((rows as any).length === 0) return res.status(403).json({ message: 'Cannot edit this request' });

    await db.query('UPDATE borrow_requests SET book_id = ? WHERE request_id = ?', [book_id, requestId]);
    res.json({ message: 'Request updated' });
  } catch (err) {
    console.error('Update request error:', err);
    res.status(500).json({ message: 'Failed to update request', error: err });
  }
});

// Delete pending borrow request
router.delete('/:id', authMiddleware, studentOnly, async (req: Request, res: Response) => {
  const studentId = req.user!.userId;
  const requestId = req.params.id;

  try {
    const [rows] = await db.query(
      'SELECT * FROM borrow_requests WHERE request_id = ? AND student_id = ? AND status = "pending"',
      [requestId, studentId]
    );
    if ((rows as any).length === 0) return res.status(403).json({ message: 'Cannot delete this request' });

    await db.query('DELETE FROM borrow_requests WHERE request_id = ?', [requestId]);
    res.json({ message: 'Request deleted' });
  } catch (err) {
    console.error('Delete request error:', err);
    res.status(500).json({ message: 'Failed to delete request', error: err });
  }
});

// Get all own requests
router.get('/student/:id', authMiddleware, studentOnly, async (req: Request, res: Response) => {
  const studentId = req.user!.userId;

  try {
    const [rows] = await db.query(
      'SELECT br.*, b.title, b.available_copies FROM borrow_requests br JOIN books b ON br.book_id = b.book_id WHERE br.student_id = ?',
      [studentId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch own requests error:', err);
    res.status(500).json({ message: 'Failed to fetch requests', error: err });
  }
});

// ---------------- Staff/Admin Endpoints ----------------

// Get all requests
router.get('/', authMiddleware, staffAdmin, async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      'SELECT br.*, s.first_name, s.last_name, b.title FROM borrow_requests br JOIN students s ON br.student_id = s.student_id JOIN books b ON br.book_id = b.book_id'
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch all requests error:', err);
    res.status(500).json({ message: 'Failed to fetch requests', error: err });
  }
});

// Approve borrow request
router.put('/:id/approve', authMiddleware, staffAdmin, async (req: Request, res: Response) => {
  const userId = req.user!.userId; // From JWT
  const requestId = req.params.id;

  try {
    // Get staff_id
    const [staffRows] = await db.query('SELECT staff_id FROM staff WHERE user_id = ?', [userId]);
    if ((staffRows as any).length === 0) return res.status(403).json({ message: 'Staff record not found' });
    const staffId = (staffRows as any)[0].staff_id;

    // Fetch request
    const [rows] = await db.query('SELECT * FROM borrow_requests WHERE request_id = ? AND status = "pending"', [requestId]);
    const request = (rows as any)[0];
    if (!request) return res.status(404).json({ message: 'Request not found or already handled' });

    // Check available copies
    const [books] = await db.query('SELECT available_copies FROM books WHERE book_id = ?', [request.book_id]);
    const book = (books as any)[0];
    if (!book || book.available_copies <= 0) return res.status(400).json({ message: 'Book not available' });

    // Insert into borrowing_transaction
    await db.query(
      'INSERT INTO borrowing_transaction (student_id, book_id, borrow_date, due_date, staff_id, status) VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), ?, "borrowed")',
      [request.student_id, request.book_id, staffId]
    );

    // Update borrow request status
    await db.query('UPDATE borrow_requests SET status = "approved", handled_by_staff = ? WHERE request_id = ?', [staffId, requestId]);

    // Decrement book copies
    await db.query('UPDATE books SET available_copies = available_copies - 1 WHERE book_id = ?', [request.book_id]);

    res.json({ message: 'Request approved and borrowed' });
  } catch (err) {
    console.error('Approve request error:', err);
    res.status(500).json({ message: 'Failed to approve request', error: err });
  }
});

// Deny borrow request
router.put('/:id/deny', authMiddleware, staffAdmin, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const requestId = req.params.id;

  try {
    // Get staff_id
    const [staffRows] = await db.query('SELECT staff_id FROM staff WHERE user_id = ?', [userId]);
    if ((staffRows as any).length === 0) return res.status(403).json({ message: 'Staff record not found' });
    const staffId = (staffRows as any)[0].staff_id;

    // Fetch request
    const [rows] = await db.query('SELECT * FROM borrow_requests WHERE request_id = ? AND status = "pending"', [requestId]);
    if ((rows as any).length === 0) return res.status(403).json({ message: 'Cannot deny this request' });

    await db.query('UPDATE borrow_requests SET status = "denied", handled_by_staff = ? WHERE request_id = ?', [staffId, requestId]);
    res.json({ message: 'Request denied' });
  } catch (err) {
    console.error('Deny request error:', err);
    res.status(500).json({ message: 'Failed to deny request', error: err });
  }
});

// Admin delete any request permanently
router.delete('/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const requestId = req.params.id;
  try {
    await db.query('DELETE FROM borrow_requests WHERE request_id = ?', [requestId]);
    res.json({ message: 'Request permanently deleted' });
  } catch (err) {
    console.error('Admin delete request error:', err);
    res.status(500).json({ message: 'Failed to delete request', error: err });
  }
});

export default router;
