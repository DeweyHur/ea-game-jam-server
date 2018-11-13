import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import registerProjectsRoutes from './routes/project.mjs';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'ea-game-jam',
  resave: false,
  saveUninitialized: true
}));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.body)}`);
  next(null, req, res);
});

registerProjectsRoutes('/project', app);

(async () => {  
  const { listeningUri = "localhost", PORT = 14141 } = process.env;
  app.listen(PORT, () => {
    console.log(`Listening from ${listeningUri}:${PORT}`);
  });

})().catch(err => {
  console.error(err);
});