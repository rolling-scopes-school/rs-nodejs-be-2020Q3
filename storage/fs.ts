import { promises as fsp } from 'fs';

type ItemType = {
  id: string;
  title: string;
  complete: boolean;
}

const fileName = 'items.json';

const filePath = `${__dirname}/${fileName}`;

const readItemList = async (): Promise<ItemType[]> => {
  let list: ItemType[] = [];

  try {
    const contents = await fsp.readFile(filePath, 'utf8');

    const parsedList = JSON.parse(contents);

    if (!Array.isArray(list)) {
      throw new TypeError();
    }

    list = parsedList;
  } catch (e: unknown) {
    if (!(e instanceof Error)) {
      throw e;
    }

    console.warn(`There was error: ${e.message}`)
  }

  return list;
};

const writeItemList = async (list: ItemType[]): Promise<ItemType[]> => {
  const stringifiedList = JSON.stringify(list);

  await fsp.writeFile(filePath, stringifiedList, 'utf8');

  return list;
};

const listAll = async () => {
  return readItemList();
};

const getById = async (id: string): Promise<ItemType | undefined> => {
  const list = await readItemList();

  return list.find((v) => {
    return v.id === id;
  });
};

const create = async (item: ItemType): Promise<ItemType | undefined> => {
  const list = await readItemList();

  list.push(item);

  await writeItemList(list)

  return item;
};

const update = async (item: ItemType): Promise<ItemType> => {
  const list = await readItemList();

  const index = list.findIndex((v) => {
    return v.id === item.id;
  });

  if (index !== -1) {
    throw new Error();
  }

  list[index] = item;

  await writeItemList(list)

  return item;
};

const remove = async (id: string): Promise<void> => {
  const list = await readItemList();

  const index = list.findIndex((v) => {
    return v.id === id;
  });

  list.splice(index, 1);

  await writeItemList(list)
};

export {
  listAll,
  getById,
  create,
  update,
  remove
}
