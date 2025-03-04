var express = require("express");
var router = express.Router();
var isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", isAuthenticated, function (req, res, next) {
  res.render("index", { username: req.session.user });
});

router.get("/", function (req, res, next) {
  // 1. instead of rendering login, redirect to okta's /authorize endpoint
  // res.render('login');

  var authorizeEndpoint = process.env.issuer + "/oauth2/v1/authorize";
  var clientIdQuery = "client_id=" + process.env.client_id;
  var responseTypeQuery = "response_type=" + "code";
  var responseModeQuery = "response_mode=" + "query";
  var scopeQuery = "scope=" + "openid%20email%20profile%20groups";
  var redirectUriQuery =
    "redirect_uri=" + "http://localhost:3000/authorization-code/callback";
  var stateQuery = "state=" + "abcde";

  var redirectUrl =
    authorizeEndpoint +
    "?" +
    clientIdQuery +
    "&" +
    responseTypeQuery +
    "&" +
    responseModeQuery +
    "&" +
    scopeQuery +
    "&" +
    redirectUriQuery +
    "&" +
    stateQuery;

  console.log("1. 앱에서 Okta로 Redirect되는 주소: " + redirectUrl);

  res.redirect(redirectUrl);
});

module.exports = router;
