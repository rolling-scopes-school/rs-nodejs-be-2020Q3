import * as http from 'http';

import * as express from 'express';
import * as expressWs from 'express-ws';

import * as logger from 'morgan';
import * as cors from 'cors';
import authRouter from './routes/auth';
import todoRouter from './routes/todos';
import getWsRouter from './routes/webSocket';

const app = express();

const server = http.createServer(app);

expressWs(app, server);

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/ws', getWsRouter());
app.use('/auth', authRouter);
app.use('/todos', todoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    statusCode: 404
  });
});

// error handler
app.use(function(err, req, res, next) {
  res.json({
    statusCode: 500,
    message: err.message,
    stack: err.stack
  });
});

export {
  app,
  server
};
