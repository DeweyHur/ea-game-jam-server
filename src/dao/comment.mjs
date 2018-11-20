import Mongo from 'mongodb';
import getCollection from '../mongo/dataProvider.mjs';
const ObjectID = Mongo.ObjectID;

function dao() {
  return getCollection('comments');
}

export async function getComments(postid) {
  return await dao().find({ postid: ObjectID(postid) }).toArray();
}

export async function putComment(postid, alias, text) {
  return await dao().insertOne({ postid: ObjectID(postid), alias, text, timestamp: new Date() });
}

export async function deleteComment(id, alias) {  
  return await dao().deleteOne({ _id: ObjectID(id), alias });
}