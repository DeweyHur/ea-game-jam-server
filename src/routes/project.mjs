import _ from 'lodash';
import express from 'express';
import { resError } from './util.mjs';
import { getProjects, getProject, putLike, deleteLike } from '../dao/project.mjs';

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
      const { id } = req.params;
      const project = await getProject(id);
      console.dir(project);
      return res.send(project).status(200);
    })
  },
  "/:id/like/": {
    "put": (async (req, res) => {
      const { id } = req.params;
      const { alias } = req.user;
      await putLike(id, alias);
      
      const project = await getProject(id);
      console.dir(project);
      return res.send(project).status(200);
    }),
    "delete": (async (req, res) => {
      const { id } = req.params;
      const { alias } = req.user;
      await deleteLike(id, alias);
      
      const project = await getProject(id);
      console.dir(project);
      return res.send(project).status(200);
    })
  }
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    throw { status: 401, text: "Unauthorized" };
  }
}

export default function (resource, app) {
  const router = express.Router();
  _.forEach(routers, (apis, verb) => _.forEach(apis, (func, method) => {
    const wrapper = (req, res, next) => {
      try { return func(req, res, next); }
      catch ({ status, text }) { return resError(res, status, text); }
    }
    return router[method](verb, isAuthenticated, wrapper);
  }));
  app.use(resource, router);
  console.log('Listen', _.flatMap(routers, (apis, verb) => `${_.keys(apis).join("/")} ${resource}${verb}`));
}