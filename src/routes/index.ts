import { Router } from 'express';
import bookRouter from './bookRoutes';

const appRoutes = Router();

appRoutes.use('/book', bookRouter);

export default appRoutes;
