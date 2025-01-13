import Joi from 'joi';
import { requiredEmail, requiredString } from './constant';

export const borrowBookSchema = Joi.object({
  name: requiredString.label('Name'),
  email: requiredEmail.label('Email'),
  title: requiredString.label('Title'),
});

export const extendBorrowSchema = Joi.object({
  email: requiredEmail.label('Email'),
  title: requiredString.label('Title'),
});

export const returnBookSchema = Joi.object({
  email: requiredEmail.label('Email'),
  title: requiredString.label('Title'),
});

export const viewAllBorrowedBooksSchema = Joi.object({
  email:requiredEmail.label('Email'),
});
