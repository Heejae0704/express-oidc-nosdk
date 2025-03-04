var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  // login logic to validate req.body.user and req.body.pass
  // would be implemented here. for this example any combo works

  // TODO: DB에 저장된 아이디와 패스워드 해시를 사용자 입력값과 대조하는 로직

  // regenerate the session, which is good practice to help
  // guard against forms of session fixation
  req.session.regenerate(function (err) {
    if (err) next(err)

    // store user information in session, typically a user id
    req.session.user = req.body.username

    // save the session before redirection to ensure page
    // load does not happen before session is saved
    req.session.save(function (err) {
      if (err) return next(err)
      res.redirect('/')
    })
  })
})

module.exports = router;
