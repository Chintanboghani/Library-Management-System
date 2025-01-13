import { NextFunction, Request, Response } from 'express';

export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZE: 401,
  BAD_REQUEST: 400,
  SERVER_ERROR: 500,
};

export const RESPONSE_MESSAGE = {
  SERVER_ERROR: 'Something want wrong, Please try again later or contact admin',
  EMAIL_ALREADY: 'Email is already in use, Please choose different email',
  BORROWED: 'Book borrowed successfully',
  RETURN: 'Book returned successfully',
  EXTEND: 'Book borrowed successfully',
};

export const customError = (req: Request, res: Response, next: NextFunction) => {
  res.sendError = (error: unknown, funcName: string) => {
    let message = RESPONSE_MESSAGE.SERVER_ERROR;

    let STATUS = STATUS_CODE.SERVER_ERROR;

    if (typeof error === 'string') {
      message = error;
      STATUS = STATUS_CODE.BAD_REQUEST;
    } else {
      console.log(`Error occurs in ${funcName}: ${error}`);
    }

    return res.status(STATUS).json({
      success: false,
      message,
    });
  };

  next();
};
