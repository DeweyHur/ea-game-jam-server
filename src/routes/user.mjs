import _ from "lodash";
import passport from "passport";
import passportLocal from "passport-local";
import { resError } from "./util.mjs";
import { login, getUser, putUser } from "../dao/user.mjs";

const Strategy = passportLocal.Strategy;

const getUserImpl = async alias => {
  const user = await getUser(alias);
  if (!user) {
    throw { status: 401, text: `User ${alias} not found` };
  }
  return user;
};

const loginImpl = async (req, res, next) => {
  return passport.authenticate("local", (err, user, info) => {
    req.login(user, err => {
      if (err) { throw { status: 500, text: 'Login Error' } }      
      return res.send(user).status(200);
    });
  })(req, res, next);
};

export const routes = {
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
        throw { status: 401, text: `User ${alias} is already found` };
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
      return res.status(200);
    }
  }
};

export function initPassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new Strategy(
      {
        usernameField: "alias",
        passwordField: "password"
      },
      (alias, password, done) => {
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
    console.log("serializing", user.alias);
    done(null, user.alias);
  });

  passport.deserializeUser(async (alias, done) => {
    console.log("deserializing", alias);
    const user = await getUserImpl(alias);
    done(null, user);
  });
}