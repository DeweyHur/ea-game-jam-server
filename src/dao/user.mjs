import getCollection from '../mongo/dataProvider.mjs';

function dao() {
  return getCollection('users');
}

export async function getUser(alias) {
  return await dao().findOne({ alias });
}

export async function putUser(alias, name) {
  return await dao().insertOne({ alias, name });
}