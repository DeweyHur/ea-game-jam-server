import _ from 'lodash';
import express from 'express';

export function resOK(res, code, body) {
  console.log(`${code} OK - ${JSON.stringify(body)}`);    
  return res.send(body).status(code);
}

export function resError(res, code, ...errors) {
  console.error(`${code} ERROR - `, ...errors);
  return res.status(code).send(errors);
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    throw { status: 401, text: "Unauthorized" };
  }
}

export function registerRouter(app, resource, routes, isProtected) {
  const router = express.Router();
  _.forEach(routes, (apis, verb) => _.forEach(apis, (func, method) => {
    const wrapper = (req, res, next) => {
      try { return func(req, res, next); }
      catch ({ status, text }) { return resError(res, status, text); }
    }
    const params = isProtected ? [verb, isAuthenticated, wrapper] : [verb, wrapper];
    return router[method](...params);
  }));
  app.use(resource, router);
  console.log('Listen', _.flatMap(routes, (apis, verb) => `${_.keys(apis).map(api => api.toUpperCase()).join(",")} ${resource}${verb}`));
}