//Import modules
const router = require("express").Router();
const { User, Ticket, Tech } = require("../../models");
//const { authenticate } = require("../../utlis/auth");

router.get("/", (req, res) => {
    const userId = req.session.user_id;
    if(!userId) {
        res.redirect("/login");
        return;
    }
    User.findOne({
        where: {
            id: userId
        },
        attributes: {
            exclude: ["password"]
        }
    })
    .then(dbUserData => {
        const userInfo = dbUserData.get({ plain: true });
        console.log(userInfo);
        res.render("dashboard", {userInfo, loggedIn: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;