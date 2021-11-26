const router = require('express').Router();
const { userdata } = require('../seeds/dummy');


const {User, Ticket, Tech, Note} = require('../models');


router.get('/', (req, res) => {
    res.render('homepage');
});

router.get('/login', (req, res) => {
    res.render('login');
  });

  router.get('/logout', (req, res) => {
    res.render('logout');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

// router.get('/', (req, res) => {
//     res.json('homepage');
// });
module.exports = router;

