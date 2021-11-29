//Import Modules
const router = require("express").Router();
const { User } = require("../models");
//const strategy = require("../utlis/auth");
//const passport = require("passport");

router.get("/", (req, res) => {
    res.render("home-page");
});

router.get("/login", (req, res) => {
    res.render("log-page");
});

router.post("/login", (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(userData => {
        if(!userData) {
            res.status(400).json({ message: 'No user found with that email.' });
            return;
        }

        const validPassword = userData.checkPassword(req.body.password);

        if(!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        //Successful login
        req.session.save(() => {
            // declare session variables
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;
    
            res.json({ user: userData, message: 'You are now logged in.' });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;