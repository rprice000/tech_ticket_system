const router = require('express').Router();
const { userdata } = require('../seeds/dummy');


const {User, Ticket, Tech, Note} = require('../models');


router.get('/', (req, res) => {
    res.json(userdata);
});

module.exports = router;