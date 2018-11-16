import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { initPassport, routes as userRoutes } from './routes/user.mjs';
import { routes as projectRoutes } from './routes/project.mjs';
import { registerRouter } from './routes/util.mjs';

const app = express();
app.use(cors());
app.use(session({ secret: 'ea-game-jam', resave: false, saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
initPassport(app);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.body)}`);
  next(null, req, res);
});

[{
  resource: '/user', routes: userRoutes, isProtected: false
}, { 
  resource: '/project', routes: projectRoutes, isProtected: true 
}]
.forEach(item => {
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