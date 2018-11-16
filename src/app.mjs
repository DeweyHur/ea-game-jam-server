import _ from "lodash";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";

import { initPassport, routes as userRoutes } from "./routes/user.mjs";
import { routes as projectRoutes } from "./routes/project.mjs";
import { registerRouter } from "./routes/util.mjs";

const app = express();
app.set('trust proxy', true);
app.use(
  session({
    secret: "ea-game-jam",
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: { secure: false, httpOnly: false }
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
initPassport(app);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.body)}`);
  console.log(
    `Session ID ${req.sessionID}, Stores ${_.keys(
      req.sessionStore.sessions
    ).join(",")}`
  );
  next(null, req, res);
});

[
  {
    resource: "/user",
    routes: userRoutes,
    isProtected: false
  },
  {
    resource: "/project",
    routes: projectRoutes,
    isProtected: true
  }
].forEach(item => {
  const { resource, routes, isProtected } = item;
  registerRouter(app, resource, routes, isProtected);
});

(async () => {
  const { listeningUri = "localhost", PORT = 14141 } = process.env;
  app.listen(PORT, () => {
    console.log(`Listening from ${listeningUri}:${PORT}`);
  });
})().catch(err => {
  console.error(err);
});
