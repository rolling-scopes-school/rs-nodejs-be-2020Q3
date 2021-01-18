import { ItemType } from '../types/item';
import { knex } from '../db/postgre';

const tableName = 'todos';

const assertUserId = (userId: string) => {
  if (!userId) {
    throw new Error('userId must be provided');
  }
};

const listAll = async (userId: string) => {
  assertUserId(userId);

  return knex(tableName)
    .select()
    .where({ userId });
};

const getById = async (userId: string, id: string) => {
  assertUserId(userId);

  const list = await knex(tableName)
    .select()
    .where({ id, userId });

  return list[0];
};

const create = async (userId: string, item: ItemType) => {
  assertUserId(userId);

  const { id, title, complete } = item;

  const list = await knex(tableName)
    .insert({ id, title, complete, userId })
    .returning('*');

  return list[0];
};

const update = async (userId: string, item: ItemType) => {
  assertUserId(userId);

  const { id, title, complete } = item;

  const list = await knex(tableName)
    .update({ id, title, complete, userId })
    .where({ id })
    .returning('*');

  return list[0];
};

const remove = async (userId: string, id: string) => {
  assertUserId(userId);

  if (!id) {
    return;
  }

  await knex(tableName)
    .delete()
    .where({ id, userId });
};

export {
  listAll,
  getById,
  create,
  update,
  remove,
};
