var express = require("express");
var router = express.Router();

function isAuthenticated(req, res, next) {
  // remember the entry point of the end-user in the session to finally redirect to the destination
  if (req.session.originalUrl && req.originalUrl === "/") {
    // do nothing and keep the originalUrl
  } else {
    req.session.originalUrl = req.originalUrl;
  }
  if (req.session.user) next();
  else next("route");
}

module.exports = isAuthenticated;
