//Import modules
const router = require("express").Router();
const { User, Ticket, Tech } = require("../../models");

router.get("/", (req, res) => {
    User.findAll({
        attributes: {
            exclude: ["password"]
        }
    })
    .then(userData => {
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ["password"]
        },
        include: [
            {
                model: Ticket
            },
            {
                model: Tech
            }
        ]
    })
    .then(userData => {
        if(!userData) {
            res.json({ message: `No user was found with id number ${req.params.id}.`});
            return;
        }
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
    User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        username: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
        
            res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post("/logout", (req,res) => {
    if(req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;