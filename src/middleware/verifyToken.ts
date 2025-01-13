import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/helper';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerHeader = req.headers?.authorization;
    if (bearerHeader) {
      const token = bearerHeader.replace('Bearer ', '');

      const userDetails = verifyJwt(token);

      if (userDetails) {
        const user = await prisma.user.findFirst({
          where: { id: userDetails.id },
        });

        if (user) {
          req.user = user;
          return next();
        }
      }
    }
    throw 'Unauthorized';
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};
