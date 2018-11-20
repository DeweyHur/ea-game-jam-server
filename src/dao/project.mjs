import Mongo from 'mongodb';
import getCollection from '../mongo/dataProvider.mjs';
const ObjectID = Mongo.ObjectID;

function dao() {
  return getCollection('projects');
}

export async function getProjects() {
  return await dao().find({}).toArray();
}

export async function getProject(id) {
  return await dao().findOne({ _id: ObjectID(id) });
}

export async function putLike(projectid, userid) {
  return await dao().updateOne({ _id: ObjectID(projectid) }, {
    $addToSet: { likes: userid }
  });
}

export async function deleteLike(projectid, userid) {
  return await dao().updateOne({ _id: ObjectID(projectid) }, {
    $pull: { likes: userid }
  });
}
