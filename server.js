const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');


const routes = require('./controllers');


const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({});

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


//This code sets up an Express.js session
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

//This code connects the session to our Sequelize database.
app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(routes);

app.use(express.static(path.join(__dirname, 'public')));




sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });