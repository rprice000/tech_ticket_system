const router = require('express').Router();
const {User, Ticket, Tech, Note} = require('../models');


router.get('/', (req, res) => {
    res.render('homepage');
});

router.get('/login', (req, res) => {
    // if (req.session.loggedIn) {
    //   res.redirect('/');
    //   return;
    // }
  
    res.render('login');
  });

//   router.get('/logout', (req, res) => {
//     if (req.session.loggedIn) {
//         req.session.destroy(() => {
//           res.status(204).end();
//         });
//       }
//       else {
//         res.status(404).end();
//       }
// });
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

