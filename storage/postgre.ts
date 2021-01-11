import * as initKnex from 'knex';
import { ItemType } from '../types/item';

const { PG_USERNAME, PG_PASSWORD, PG_HOST } = process.env;

const dbName = 'test';
const tableName = 'todos';

const url = process.env.DATABASE_URL
  ?? `postgres://${PG_USERNAME}:${PG_PASSWORD}@${PG_HOST}/${dbName}`;

const knex = initKnex({
  client: 'pg',
  connection: url,
  debug: true
});

const listAll = async () => {
  return knex(tableName)
    .select();
};

const getById = async (id: string) => {
  const list = await knex(tableName)
    .select()
    .where({ id });

  return list[0];
};

const create = async (item: ItemType) => {
  const { id, title, complete } = item;

  const list = await knex(tableName)
    .insert({ id, title, complete })
    .returning('*');

  return list[0];
};

const update = async (item: ItemType) => {
  const { id, title, complete } = item;

  const list = await knex(tableName)
    .update({ id, title, complete })
    .where({ id })
    .returning('*');

  return list[0];
};

const remove = async (id: string) => {
  if (!id) {
    return;
  }

  await knex(tableName)
    .delete()
    .where({ id });
};

export {
  listAll,
  getById,
  create,
  update,
  remove
}
