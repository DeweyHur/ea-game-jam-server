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

export async function putLike(projectid, userid) {
  return await dao().updateOne({ id: projectid }, {
    $addToSet: { likes: userid }
  });
}

export async function deleteLike(projectid, userid) {
  return await dao().updateOne({ id: projectid }, {
    $pop: { likes: userid }
  });
}