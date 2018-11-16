import getCollection from '../mongo/dataProvider.mjs';

function dao() {
  return getCollection('projects');
}

export async function getProjects() {
  return await dao().find({}).toArray();
}

export async function getProject(id) {
  return await dao().findOne({ id });
}

export async function putLike(id, alias) {
  return await dao().updateOne({ id }, {
    $addToSet: { likes: alias }
  });
}

export async function deleteLike(id, alias) {
  return await dao().updateOne({ id }, {
    $pop: { likes: alias }
  });
}