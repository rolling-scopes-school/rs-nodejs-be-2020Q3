import { v4 as uuid } from 'uuid';
import * as md5 from 'md5'
import { Router } from 'express';
import { knex } from '../db/postgre';
import { sessionTable, userTable } from '../constants';
import { authMw } from '../middleware/authMw';

const { PG_SALT } = process.env;

const router = Router();

const getPasswordHash = (password: string) => {
  return md5(password + PG_SALT);
}

const generateToken = () => {
  return uuid();
};

router.post('/login', async (req, res, next) => {
  const { body: { username, password } } = req;

  const passwordHash = getPasswordHash(password);

  const [user] = await knex(userTable)
    .select()
    .where({ username, passwordHash })

  const statusCode = user ? 200 : 403;
  const token = user ? generateToken() : undefined;
  const reason = user ? undefined : 'Invalid password';

  if (token) {
    await knex(sessionTable)
      .insert({
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      });
  }

  const response = {
    statusCode,
    token,
    reason
  }

  res.json(response);
});

router.post('/register', async (req, res, next) => {
  const { body: { username, email = '', password } } = req;

  let query = knex(userTable)
    .select()
    .where({ username });

  if (email) {
    query = query.orWhere({ email });
  }

  const [user] = await query;

  if (user) {
    res.json({
      statusCode: 400,
      reason: `User ${username} is already registered`
    });
    return;
  }

  if (!password || password.length < 3) {
    res.json({
      statusCode: 400,
      reason: `Password is too short`
    });
    return;
  }

  const passwordHash = getPasswordHash(password);
  const id = uuid();

  await knex(userTable)
    .insert({ id, username, passwordHash, email });

  const statusCode = 200;
  const token = generateToken();

  if (token) {
    await knex(sessionTable)
      .insert({
        token,
        userId: id,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      });
  }

  const response = {
    statusCode,
    token,
  }

  res.json(response);
});

router.post('/test', authMw, async (req, res, next) => {
  res.status(200).json({
    statusCode: 200,
  });
});

export default router;
