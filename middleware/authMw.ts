import { getSessionByToken } from '../service/authService';
import { NextFunction, Request, Response } from 'express';
import { Session } from '../types/item';

export const authMw = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('authorization');

  if (!token) {
    res.status(400).json({
      statusCode: 400,
      reason: 'No auth token is provided',
    });
    return;
  }

  const session: Session = await getSessionByToken(token);

  if (!session) {
    res.status(403).json({
      statusCode: 403,
    });
    return;
  }

  req.app.set('userId', session.userId);

  next();
};
