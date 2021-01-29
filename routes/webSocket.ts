import { Router } from 'express';
import { Session } from '../types/item';
import { getSessionByToken } from '../service/authService';
import * as storage from '../storage/postgre';
import { v4 as uuid } from 'uuid';

const getWsRouter = () => {
  const router = Router();

  type ClientMessage = {
    id: string;
    auth: string;
    type: string;
    data: any;
  }

  router.ws('/', (ws) => {
    const receiveMessage = (handler: (message: ClientMessage) => Promise<unknown>) => {
      return async (messageText: string) => {
        const message = JSON.parse(messageText) as ClientMessage;

        const result = await handler(message);

        ws.send(JSON.stringify(result));
      }
    };

    ws.on('message', receiveMessage(async (message: ClientMessage): Promise<unknown> => {
      const session: Session = await getSessionByToken(message.auth);

      if (!session) {
        return {
          error: 'No session'
        }
      }

      const { id } = message;

      if (message.type === 'listAll') {
        const data = await storage.listAll(session.userId);

        return {
          id,
          data
        };
      } else if (message.type === 'create') {
        const todoId = uuid();

        const data = await storage.create(
          session.userId,
          {
            id: todoId,
            ...message.data
          }
        );

        return {
          id,
          data
        };
      } else if (message.type === 'update') {
        const data = await storage.update(
          session.userId,
          { ...message.data }
        );

        return {
          id,
          data
        };
      } else if (message.type === 'remove') {
        const data = await storage.remove(
          session.userId,
          message.data.id
        );

        return {
          id,
          data
        };
      }
    }));
  });

  return router;
}

export default getWsRouter;
