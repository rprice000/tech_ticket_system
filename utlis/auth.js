//Import module
//const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = passport => {
    const strategy = new LocalStrategy();
};