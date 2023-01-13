const express = require('express');
const { DateTime } = require('luxon');
var cors = require('cors');
var { expressjwt: jwt } = require("express-jwt");
require('dotenv').config();

const initJsonHandlerMiddlware = (app) => app.use(express.json());
const middlewareStatic = (app) => app.use(express.static('public'));
const middlewareCors = (app) => app.use(cors());
const middleWareJwt = (app) => app.use(
  jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ["HS256"],
  }).unless({ path: [{ url: "/users", methods: ["POST"] }, { url: "/auth/login", methods: [ "POST"] }] })
);

const initLoggerMiddlware = (app) => {
  app.use((req, res, next) => {
    const begin = new DateTime(new Date());

    res.on('finish', () => {
      const requestDate = begin.toString();
      const remoteIP = `IP: ${req.connection.remoteAddress}`;
      const httpInfo = `${req.method} ${req.baseUrl || req.path}`;

      const end = new DateTime(new Date());
      const requestDurationMs = end.diff(begin).toMillis();
      const requestDuration = `Duration: ${requestDurationMs}ms`;

      console.log(`[${requestDate}] - [${remoteIP}] - [${httpInfo}] - [${requestDuration}]`);
    })
    next();
  });
};

exports.initializeConfigMiddlewares = (app) => {
  initJsonHandlerMiddlware(app);
  initLoggerMiddlware(app);
  middlewareStatic(app);
  middlewareCors(app);
  middleWareJwt(app)
}

exports.initializeErrorMiddlwares = (app) => {
  app.use((err, req, res, next) => {
    res.status(500).send(err.message);
  });
}
