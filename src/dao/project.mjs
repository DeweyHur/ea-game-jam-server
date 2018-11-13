import getCollection from '../mongo/dataProvider.mjs';

function dao() {
  return getCollection('projects');
}

export async function getProjects() {
  return await dao().find({}).toArray();
}