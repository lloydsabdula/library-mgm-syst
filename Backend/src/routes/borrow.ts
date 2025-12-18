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

// STUDENT borrows a book
router.post('/borrow', authMiddleware, allowRoles('students'), async (req: Request, res: Response) => {
  const studentId = req.user!.userId;
  const { book_id, due_date } = req.body;

  if (!book_id || !due_date) return res.status(400).json({ message: 'Missing fields' });

  try {
    const [books] = await db.query('SELECT * FROM books WHERE book_id = ?', [book_id]);
    if ((books as any).length === 0) return res.status(404).json({ message: 'Book not found' });

    const book = (books as any)[0];
    if (book.available_copies <= 0) return res.status(400).json({ message: 'No available copies' });

    // Insert borrowing transaction with staff_id = NULL
    const [result] = await db.query(
      'INSERT INTO borrowing_transaction (student_id, book_id, borrow_date, due_date, staff_id, status) VALUES (?, ?, CURDATE(), ?, ?, ?)',
      [studentId, book_id, due_date, null, 'borrowed']
    );

    await db.query('UPDATE books SET available_copies = available_copies - 1 WHERE book_id = ?', [book_id]);

    res.json({ message: 'Book borrowed', transactionId: (result as any).insertId });
  } catch (err) {
    console.error('Borrow route error:', err);
    res.status(500).json({ message: 'Borrow failed', error: (err as any).sqlMessage || err });
  }
});

// STAFF processes return and calculates penalty
router.post('/return/:transactionId', authMiddleware, allowRoles('staff', 'admin'), async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM borrowing_transaction WHERE transaction_id = ?', [transactionId]);
    const transaction = (rows as any)[0];
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status !== 'borrowed') return res.status(400).json({ message: 'Book already returned' });

    // Get staff_id from staff table
    const [staffRows] = await db.query('SELECT staff_id FROM staff WHERE user_id = ?', [req.user!.userId]);
    if ((staffRows as any).length === 0) return res.status(400).json({ message: 'Staff record not found' });
    const staffId = (staffRows as any)[0].staff_id;

    const returnDate = new Date();
    const dueDate = new Date(transaction.due_date);

    // Calculate penalty if late
    let penaltyAmount = 0;
    if (returnDate > dueDate) {
      const daysLate = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
      penaltyAmount = daysLate * 10; // 10 units per day late

      await db.query(
        'INSERT INTO penalty (transaction_id, staff_id, amount, reason, date_issued, student_id) VALUES (?, ?, ?, ?, CURDATE(), ?)',
        [transactionId, staffId, penaltyAmount, `Late by ${daysLate} days`, transaction.student_id]
      );
    }

    // Update return with correct staff_id
    await db.query(
      'UPDATE borrowing_transaction SET return_date = CURDATE(), status = ?, staff_id = ? WHERE transaction_id = ?',
      ['returned', staffId, transactionId]
    );

    await db.query('UPDATE books SET available_copies = available_copies + 1 WHERE book_id = ?', [transaction.book_id]);

    res.json({ message: 'Book returned', penalty: penaltyAmount });
  } catch (err) {
    console.error('Return route error:', err);
    res.status(500).json({ message: 'Return failed', error: (err as any).sqlMessage || err });
  }
});

// STUDENT sees own transactions
router.get('/my', authMiddleware, allowRoles('students'), async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.userId;
    const [transactions] = await db.query(
      'SELECT bt.*, b.title, b.author FROM borrowing_transaction bt JOIN books b ON bt.book_id = b.book_id WHERE bt.student_id = ?',
      [studentId]
    );
    res.json(transactions);
  } catch (err) {
    console.error('My transactions error:', err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// STAFF/ADMIN sees all transactions
router.get('/all', authMiddleware, allowRoles('staff', 'admin'), async (req: Request, res: Response) => {
  try {
    const [transactions] = await db.query(
      'SELECT bt.*, b.title, b.author, s.first_name AS student_first, s.last_name AS student_last FROM borrowing_transaction bt JOIN books b ON bt.book_id = b.book_id JOIN students s ON bt.student_id = s.student_id'
    );
    res.json(transactions);
  } catch (err) {
    console.error('All transactions error:', err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

export default router;
