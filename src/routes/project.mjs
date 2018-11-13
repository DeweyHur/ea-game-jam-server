import _ from 'lodash';
import express from 'express';
import { resError } from './util.mjs';
import { getProjects } from '../dao/project.mjs';

const routers = {
  "/": {
    "get": (async (req, res) => {
      try {
        const projects = await getProjects();
        console.dir(projects);
        return res.send(projects).status(200);
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