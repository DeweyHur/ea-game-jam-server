import _ from 'lodash';
import express from 'express';
import { resError } from './util.mjs';
import { getProjects, getProject } from '../dao/project.mjs';
import { getUser } from '../dao/user.mjs';

const routers = {
  "/": {
    "get": (async (req, res) => {
      const projects = await getProjects();
      console.dir(projects);
      return res.send(projects).status(200);
    })
  },
  "/:id/": {
    "get": (async (req, res) => {
      const project = await getProject();
      console.dir(project);
      return res.send(project).status(200);
    })
  },
  "/:id/like/": {
    "put": (async (req, res) => {
      

    }),
    "delete": (async (req, res) => {

    })
  }
}

function isAuthenticated(req, res, next) {
  return req.session.name !== undefined;
}

export default function (resource, app) {
  const router = express.Router();
  _.forEach(routers, (apis, verb) => _.forEach(apis, (func, method) => {
    const wrapper = (req, res) => {
      try { return func(req, res); }
      catch (e) { return resError(res, 500, e); }
    }
    return router[method](verb, wrapper);
  }));
  app.use(resource, router);
  console.log('Listen', _.flatMap(routers, (apis, verb) => `${_.keys(apis).join("/")} ${resource}${verb}`));
}