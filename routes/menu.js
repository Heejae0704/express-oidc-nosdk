var express = require('express');
var router = express.Router();
var isAuthenticated = require('../middleware/isAuthenticated');

router.get('/1', isAuthenticated, function(req, res, next) {
  res.render('menu', { message: '로그인이 필요한 첫 번째 메뉴입니다', username: req.session.user });
});

router.get('/2', isAuthenticated, function(req, res, next) {
  res.render('menu', { message: '로그인이 필요한 두 번째 메뉴입니다', username: req.session.user });
});

router.get('/3', isAuthenticated, function(req, res, next) {
  res.render('menu', { message: '로그인이 필요한 세 번째 메뉴입니다', username: req.session.user });
});

router.get('/4', isAuthenticated, function(req, res, next) {
  res.render('menu', { message: '로그인이 필요한 네 번째 메뉴입니다', username: req.session.user });
});

router.use(function(req, res, next) {
  res.redirect('/')
});

module.exports = router;
