import _ from 'lodash';
import express from 'express';
import { resError } from './util.mjs';
import { getUser, putUser } from '../dao/user.mjs';

const routers = {
  "/:alias": {
    "get": (async (req, res) => {
      try {
        const { alias } = req.params;
        const user = await getUser(alias);
        if (!user) {
          return resError(res, 401, `User ${alias} not found`);
        }        
        return res.send(user).status(200);
      } catch (e) {
        return resError(res, 500, e);
      }
    }),
    "put": (async (req, res) => {
      try {
        const { alias } = req.params;
        let user = await getUser(alias);
        if (user) {
          return resError(res, 401, `User ${alias} is already found`);
        }

        const { name } = req.body;
        await putUser(alias, name);
        return res.send({ alias, name }).status(200);
      } catch (e) {
        return resError(res, 500, e);
      }
    })
  }
}

export default function (resource, app) {
  const router = express.Router();
  _.forEach(routers, (apis, verb) => _.forEach(apis, (func, method) => router[method](verb, func)));
  app.use(resource, router);
  console.log('Listen', _.flatMap(routers, (apis, verb) => `${_.keys(apis).join("/")} ${resource}${verb}`));
}