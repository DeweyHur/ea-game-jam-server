import Mongo from 'mongodb';
import getCollection from '../mongo/dataProvider.mjs';
const ObjectID = Mongo.ObjectID;

function dao() {
  return getCollection('votes');
}

export async function getVotesByProject(postid) {
  return await dao().find({ postid: ObjectID(postid) }).toArray();
}

export async function getVotesByUser(alias) {
  return await dao().find({ alias }).toArray();
}

export async function putVote(postid, alias, text) {
  return await dao().insertOne({ postid: ObjectID(postid), alias });
}

export async function deleteVote(postid, alias) {  
  return await dao().deleteOne({ postid: ObjectID(postid), alias });
}