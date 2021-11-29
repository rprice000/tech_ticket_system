//Import modules
const router = require("express").Router();
const { User } = require("../../models");
const passport = require("passport");

const ticketRoutes = require("./ticket");
const basicRoutes = require("./basic");

router.use("/ticket", ticketRoutes);
router.use(basicRoutes);

module.exports = router;