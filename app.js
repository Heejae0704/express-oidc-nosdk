var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var { jwtDecode } = require("jwt-decode");

var indexRouter = require("./routes/index");
// var loginRouter = require("./routes/login");
var logoutRouter = require("./routes/logout");
var menuRouter = require("./routes/menu");
var usersRouter = require("./routes/users");

require("dotenv").config();

var app = express();

app.use(
  session({
    secret: "PleaseLookTheOtherWay",
    resave: false,
    saveUninitialized: true,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/menu", menuRouter);
app.use("/users", usersRouter);

// 2. create callback route
app.get("/authorization-code/callback", async function (req, res, next) {
  console.log("2. Okta에서 앱에 전달된 인가 코드: " + req.query.code);

  var client_secret = process.env.client_secret;
  var client_id = process.env.client_id;
  var AuthorizationHeaderValue =
    "Basic " + btoa(client_id + ":" + client_secret);

  const formData = {
    code: req.query.code,
    grant_type: "authorization_code",
    redirect_uri: "http://localhost:3000/authorization-code/callback",
  };

  try {
    const resp = await fetch(process.env.issuer + "/oauth2/v1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: AuthorizationHeaderValue,
      },
      body: new URLSearchParams(formData).toString(),
    });

    const data = await resp.json();
    console.log("3. Okta에서 전달받은 ID Token: " + data.id_token);

    const decodedIdToken = jwtDecode(data.id_token);

    console.log("4. ID Token을 풀면 나오는 사용자 정보: ");
    console.log(decodedIdToken);

    req.session.user = decodedIdToken.preferred_username;
    req.session.id_token = data.id_token;

    // optional: userinfo 받아오기
    const userInfoResp = await fetch(
      process.env.issuer + "/oauth2/v1/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + data.access_token,
        },
      }
    );

    const userInfoData = await userInfoResp.json();

    console.log("5. /userinfo 호출로 추가로 불러올 수 있는 사용자 정보: ");
    console.log(userInfoData);

    res.redirect("/");
  } catch (error) {
    next(createError(500));
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
