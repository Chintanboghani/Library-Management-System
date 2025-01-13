import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RESPONSE_MESSAGE, STATUS_CODE } from '../utils/response';
import { date } from 'joi';
import { stat } from 'fs';

const prisma = new PrismaClient();

export const borrowBook = async (req: Request, res: Response) => {
  const { name, email, title } = req.body;

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { name, email },
    });

    const book = await prisma.book.findFirst({
      where: {
        title,
        copies: { gt: 0 },
      },
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not available' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const borrow = await prisma.borrow.create({
      data: {
        userId: user.id,
        bookId: book.id,
        dueDate,
      },
      include: {
        user: true,
        book: true,
      },
    });

    await prisma.book.update({
      where: { id: book.id },
      data: { copies: { decrement: 1 } },
    });

    return res.status(200).json({
      data: {
        userName: borrow.user.name,
        bookTitle: borrow.book.title,
        dueDate: borrow.dueDate,
      },
      success: true,
      statusCode: STATUS_CODE.CREATED,
      message: RESPONSE_MESSAGE.BORROWED,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const viewBorrowedBooks = async (req: Request, res: Response) => {
  const { email } = req.query;

  try {
    const borrows = await prisma.borrow.findMany({
      where: {
        user: { email: email as string },
        returned: false,
      },
      include: {
        book: true,
      },
    });

    return res.status(200).json({ date: borrows, success: true, statusCode: STATUS_CODE.OK });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const viewAllBorrowedBooks = async (req: Request, res: Response) => {
  try {
    const borrows = await prisma.borrow.findMany({
      where: { returned: false },
      include: {
        user: true,
        book: true,
      },
    });

    return res.status(200).json({ data: borrows, success: true, statusCode: STATUS_CODE.OK });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const returnBook = async (req: Request, res: Response) => {
  const { email, title } = req.body;

  try {
    const borrow = await prisma.borrow.findFirst({
      where: {
        user: { email },
        book: { title },
        returned: false,
      },
      include: {
        book: true,
      },
    });

    if (!borrow) {
      return res.status(404).json({ error: 'No active borrow found' });
    }

    await prisma.$transaction([
      prisma.borrow.update({
        where: { id: borrow.id },
        data: { returned: true },
      }),
      prisma.book.update({
        where: { id: borrow.book.id },
        data: { copies: { increment: 1 } },
      }),
    ]);

    return res
      .status(200)
      .json({ success: true, statusCode: STATUS_CODE.OK, message: RESPONSE_MESSAGE.RETURN });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const extendBorrowingPeriod = async (req: Request, res: Response) => {
  const { email, title } = req.body;

  try {
    const borrow = await prisma.borrow.findFirst({
      where: {
        user: { email },
        book: { title },
        returned: false,
      },
    });

    if (!borrow) {
      return res.status(404).json({ error: 'No active borrow found' });
    }

    const newDueDate = new Date(borrow.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 7);

    const updatedBorrow = await prisma.borrow.update({
      where: { id: borrow.id },
      data: { dueDate: newDueDate },
    });

    return res.status(200).json({
      data: updatedBorrow,
      success: true,
      statusCode: STATUS_CODE.OK,
      message: RESPONSE_MESSAGE.EXTEND,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
