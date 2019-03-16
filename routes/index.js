var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MySQL Writer Simulator' });
});

router.get('/health', function(req, res, next) {
  res.jsonp({
    status: 'OK'
  });
});

module.exports = router;
