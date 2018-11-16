import getCollection from "../mongo/dataProvider.mjs";

function dao() {
  return getCollection("users");
}

export async function getUser(alias) {
  return await dao().findOne({ alias });
}

export async function login(alias, password) {
  const user = await dao().findOne({ alias, password });
  if (user) {
    return { ...user, password: undefined };
  } else {
    throw 'No record matches.';
  }
}

export async function putUser(alias, name, password) {
  return await dao().insertOne({ alias, name, password });
}
