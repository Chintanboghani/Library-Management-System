import { Request } from 'express';
import Jwt from 'jsonwebtoken';

export const createJwt = (payload: object) => {
  return Jwt.sign(payload, process.env.SECRET ?? 'BACKEND_APK');
};

export interface JWTResponse {
  id: number;
  sequence: number;
}

export const verifyJwt = (token: string) => {
  return Jwt.verify(token, process.env.SECRET ?? 'BACKEND_APK') as JWTResponse;
};
