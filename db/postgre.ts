import * as initKnex from 'knex';

const { PG_USERNAME, PG_PASSWORD, PG_HOST } = process.env;

const dbName = 'test';


const url = process.env.DATABASE_URL
  ?? `postgres://${PG_USERNAME}:${PG_PASSWORD}@${PG_HOST}/${dbName}`;

const knex = initKnex({
  client: 'pg',
  connection: url,
  debug: true
});

export { knex };
