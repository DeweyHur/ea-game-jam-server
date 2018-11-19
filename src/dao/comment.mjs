import Mongo from 'mongodb';
import getCollection from '../mongo/dataProvider.mjs';
const ObjectID = Mongo.ObjectID;

function dao() {
  return getCollection('comments');
}

export async function getComments(postid) {
  return await dao().find({ postid: ObjectID(postid) }).toArray();
}

export async function putComment(postid, name, text) {
  return await dao().insertOne({ postid: ObjectID(postid), name, text, timestamp: new Date() });
}

export async function deleteComment(postid, name) {  
  return await dao().deleteOne({ postid: ObjectID(postid), name });
}