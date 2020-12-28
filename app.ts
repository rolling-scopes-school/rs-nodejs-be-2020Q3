import * as express from 'express';
import * as logger from 'morgan';
import * as cors from 'cors';
import todoRouter from './routes/todos';

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/todos', todoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.json({
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

export default app;
