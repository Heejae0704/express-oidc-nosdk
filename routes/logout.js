var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  // logout logic

  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null;

  // 3. Logout 구현 (Okta에서도 로그아웃)
  res.redirect(
    process.env.issuer +
      "/oauth2/v1/logout?id_token_hint=" +
      req.session.id_token +
      "&post_logout_redirect_uri=http://localhost:3000"
  );
  // req.session.save(function (err) {
  //   if (err) next(err)

  //   // regenerate the session, which is good practice to help
  //   // guard against forms of session fixation
  //   req.session.regenerate(function (err) {
  //     if (err) next(err)
  //     res.redirect('/')
  //   })
  // })
});

module.exports = router;
