import express from 'express';
import { testConnection } from './db';
import authRouter from './routes/auth';
import booksRouter from './routes/books';
import borrowRouter from './routes/borrow';
import penaltyRouter from './routes/penalty';
import usersRouter, { deleteOldAccounts } from './routes/users';
import cron from 'node-cron';
import borrowRequestRouter from './routes/borrowRequest';

const app = express();
app.use(express.json());

// ------------------- Test route -------------------
app.get('/test', (req, res) => res.send('API is working'));

// ------------------- Routes -------------------
app.use('/auth', authRouter);
app.use('/books', booksRouter);
app.use('/borrow', borrowRouter);
app.use('/penalty', penaltyRouter);
app.use('/users', usersRouter);
app.use('/borrow-request', borrowRequestRouter);

// ------------------- Schedule daily deletion -------------------
// Runs every day at 2:00 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Running scheduled deletion of old accounts...');
  await deleteOldAccounts();
});

// ------------------- Start server -------------------
app.listen(3000, async () => {
  console.log('Server running on port 3000');
  await testConnection();
});
