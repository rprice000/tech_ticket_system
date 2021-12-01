const router = require('express').Router();
const { userdata } = require('../seeds/dummy');
const withAuth = require('../utils/auth');

const {User, Ticket, Tech, Note} = require('../models');


router.get('/', (req, res) => {
    const loggedIn = req.session.user_id ? true : false;
    res.render('homepage', { loggedIn });
});

router.get('/login', (req, res) => {
    res.render('login');
  });
/*
  router.get('/logout', (req, res) => {
    res.render('logout');
});
*/
router.get('/signup', (req, res) => {
    res.render('signup');
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
                    model: Ticket
                },
                {
                    model: Tech,
                    include: [
                        {
                            model: Ticket
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

// router.get('/', (req, res) => {
//     res.json('homepage');
// });
module.exports = router;

