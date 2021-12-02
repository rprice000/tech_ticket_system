const router = require('express').Router();
const withAuth = require('../utils/auth');

const {User, Ticket, Tech, Note} = require('../models');


router.get('/', (req, res) => {
        res.redirect('/dashboard');
});

router.get('/login', (req, res) => {
    // if (req.session.loggedIn) {
    //   res.redirect('/');
    //   return;
    // }
  
    res.render('login');
  });

  router.get('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
          res.status(204).end();
        });
      }
      else {
        res.status(404).end();
      }
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

router.get('/dashboard', withAuth, (req, res) => {
    User.findOne(
        {
            where: {
                id: req.session.user_id
            },
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    model: Ticket,
                    include: [
                        {
                            model: User,
                            attributes: ['first_name','last_name']
                        }
                    ]
                },
                {
                    model: Tech,
                    include: [
                        {
                            model: Ticket,
                            include: [
                                {
                                    model: User,
                                    attributes: ['first_name','last_name']
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    )
    .then(userInfo => {
        //Will include other models later
        const userStats = userInfo.get({ plain: true });
        console.log(userStats);
        console.log(userStats.teches);
        res.render('dashboard', {
            userData: userStats,
            loggedIn: true
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/homepage', withAuth, (req, res) => {
    res.render('homepage', {loggedIn: true, user_id: req.session.user_id});
});
module.exports = router;

