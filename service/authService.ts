import { knex } from '../db/postgre';
import { sessionTable } from '../constants';

export const getSessionByToken = async (token: string) => {
  if (!token) {
    throw new Error('No token is provided');
  }

  const [session] = await knex(sessionTable)
    .select()
    .where({ token });

  const result = session && new Date(session.expiresAt).getTime() > Date.now()
    ? session : null;

  if (!result && session) {
    // TODO clean DB
  }

  return result;
};
