//Import modules
const express = require("express");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const path = require("path");
const exphbs = require("express-handlebars");
//const helpers = require("./lib/helpers");
const hbs = exphbs.create({});
const session = require("express-session");
//const passport = require("passport");

//require("./utlis/auth")(passport);

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
    secret: process.env.SESSION_PASSWORD,
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(session(sess));
//app.use(passport.initialize());
//app.use(passport.session());
app.use(express.static(path.join(__dirname + "/public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});