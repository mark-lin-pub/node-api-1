import express, {NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as fs from 'fs';

import CacheControl from './middleware/cacheControl';
import HttpLogger from "./middleware/httpLogger";
import ErrorHandler from './middleware/errorHandler';

import Shutdown from './utils/shutdown';
import Logger from "./utils/logger";

const app = express();
const port = process.env.PORT || undefined;
const env = process.env.NODE_ENV || 'none';
const sample = process.env.SAMPLE || 'none';
const secret = process.env.DB_PASSWORD || 'none';

/*
* TODO:
* 1. Add log middleware HTTP (winston with custom middleware) + loghelper => OK
* 2. CORS => OK
* 3. SwaggerUI
* 4. Sequelize + folder structure + model validation
* 5. Depedency Injection
* 
* */

app.disable('x-powered-by');
app.disable('etag');

app.use(cors({
  origin: function (origin, callback) {
    try{
      if (process.env.CORS === '*' || process.env.CORS.split(",").indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(null,false)
      }
    } catch (err){
      callback(err,false)
    }
  },
  methods:['OPTIONS','GET','POST'],
  allowedHeaders: []
}));

app.use(bodyParser.json());
app.use(CacheControl.DisableCache);
app.use(HttpLogger.HttpLogger);


app.get('/', (req: Request, res: Response) => {
  res.json({message: `Hello ${env} - ${sample}!`});
});

app.get('/error', function(req: Request, res:Response, next: NextFunction) {
  // here we cause an error in the pipeline so we see express-winston in action.
  throw new Error("This is an error and it should be logged to the console");
});

app.use(HttpLogger.HttpErrorLogger);
app.use(ErrorHandler.HandleError);

const server = app.listen(port)
  .on("listening", () => {
    const words = fs.readFileSync(secret, 'utf-8');
    Logger.info(`Express is listening on port ${port} env: ${env} sample: ${sample} secret: ${words}`, {dataid: 123});
  }).on('error', (err) => {
    Logger.error("Unexpexted error",err);
    process.exit(1);
  });

process
  .on('unhandledRejection', (reason, promise) => {
    Logger.error('Unhandled Rejection at Promise', {reason: reason, promise: promise});
  })
  .on('uncaughtException', err => {
    Logger.error('Uncaught Exception thrown', err);
    Shutdown.GracefulShutdown(1, server);
  }).on('SIGTERM', signal => {
    //SIGTERM is normally sent by a process monitor to tell Node.js to expect a successful termination
    Logger.info(`Process ${process.pid} received a SIGTERM signal`);
    Shutdown.GracefulShutdown(0, server);
  }).on('SIGINT', signal => {
    //SIGINT is emitted when a Node.js process is interrupted, usually as the result of a control-C (^-C) keyboard event.
    Logger.info(`Process ${process.pid} has been interrupted`)
    Shutdown.GracefulShutdown(0, server);
  });


