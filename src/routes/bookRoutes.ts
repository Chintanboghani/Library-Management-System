import express from 'express';
// import { authenticateUser } from '../middleware/verifyToken';
import {
  borrowBookSchema,
  extendBorrowSchema,
  returnBookSchema,
  viewAllBorrowedBooksSchema,
} from '../validation/bookValidation';
import {
  borrowBook,
  viewBorrowedBooks,
  viewAllBorrowedBooks,
  returnBook,
  extendBorrowingPeriod,
} from '../controllers/bookController';
import { validateWithSchema } from '../validation/constant';

const bookRouter = express.Router();

bookRouter.post(
  '/borrow',
  // authenticateUser,
  validateWithSchema(borrowBookSchema),
  borrowBook
);

bookRouter.get(
  '/borrowed',
  // authenticateUser,
  validateWithSchema(viewAllBorrowedBooksSchema,'query'),
  viewBorrowedBooks
);

bookRouter.get(
  '/all-borrowed',
  // authenticateUser,
  viewAllBorrowedBooks
);

bookRouter.post(
  '/return',
  // authenticateUser,
  validateWithSchema(returnBookSchema),
  returnBook
);

bookRouter.post(
  '/extend',
  // authenticateUser,
  validateWithSchema(extendBorrowSchema),
  extendBorrowingPeriod
);

export default bookRouter;