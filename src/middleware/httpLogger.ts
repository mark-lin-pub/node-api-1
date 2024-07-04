import winston  from 'winston';
import expressWinston from 'express-winston';  

const HttpErrorLogger = expressWinston.errorLogger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  })

const HttpLogger = expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    dynamicMeta: function(req, res) {
      return {
        user: "anonymous"
      }
    },
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; }, // optional: allows to skip some log messages based on request and/or response
    statusLevels: false, 
    level: function (req, res) {
      let level = "";
      if (res.statusCode >= 100) { level = "info"; }
      if (res.statusCode >= 400) { level = "warn"; }
      if (res.statusCode >= 500) { level = "error"; }
      // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
      if (res.statusCode == 401 || res.statusCode == 403) { level = "warn"; }
      return level;
    }
  })

export default {HttpLogger, HttpErrorLogger }