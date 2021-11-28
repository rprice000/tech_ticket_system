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
router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/active', (req, res) => {
    res.render('active');
});

router.get('/single-ticket', (req, res) => {
    res.render('single-ticket');
});

// router.get('/', (req, res) => {
//     res.json('homepage');
// });
module.exports = router;

