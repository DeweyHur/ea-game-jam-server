import _ from "lodash";
import express from "express";
import passport from "passport";
import passportLocal from "passport-local";
import { resError } from "./util.mjs";
import { login, getUser, putUser } from "../dao/user.mjs";

const Strategy = passportLocal.Strategy;

const getUserImpl = async alias => {
  const user = await getUser(alias);
  if (!user) {
    throw `User ${alias} not found`;
  }
  return user;
};

const loginImpl = async (req, res, next) => {
  return passport.authenticate("local", (err, user, info) => {
    req.login(user, err => {
      return res.send(user).status(200);
    });
  })(req, res, next);
}

const routers = {
  "/:alias": {
    get: async (req, res) => {
      const { alias } = req.params;
      const user = await getUserImpl(alias);
      return res.send(user).status(200);
    },
    put: async (req, res) => {
      const { alias } = req.params;
      const user = await getUser(alias);
      if (user) {
        return resError(res, 401, `User ${alias} is already found`);
      }

      const { name, password } = req.body;
      await putUser(alias, name, password);
      return await loginImpl(req, res, next);
    }
  },
  "/login": {
    post: loginImpl
  },
  "/logout": {
    post: async (req, res) => {
      req.logout();
      return res.send(user).status(200);
    }
  }
};

export function initPassport(app) {
  passport.use(
    new Strategy(
      {
        usernameField: "alias",
        passwordField: "password"
      },
      (alias, password, done) => {
        console.log(`alias - ${alias}, password - ${password}`);
        (async () => {
          try {
            const user = await login(alias, password);
            done(null, user);
          } catch (e) {
            return done(e);
          }
        })();
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.dir(user);
    console.log(
      "Inside serializeUser callback. User id is save to the session file store here"
    );
    done(null, user.alias);
  });

  app.use(passport.initialize());
  app.use(passport.session());
}

export function initRoutes(resource, app) {
  const router = express.Router();
  _.forEach(routers, (apis, verb) =>
    _.forEach(apis, (func, method) => {
      const wrapper = (req, res, next) => {
        try {
          return func(req, res, next);
        } catch (e) {
          return resError(res, 500, e);
        }
      };
      return router[method](verb, wrapper);
    })
  );
  app.use(resource, router);
  console.log(
    "Listen",
    _.flatMap(
      routers,
      (apis, verb) => `${_.keys(apis).join("/")} ${resource}${verb}`
    )
  );
}
