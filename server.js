const sequelize = require('./config/connection');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path')

const routes = require('./controllers');


const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(routes);

app.use(express.static(path.join(__dirname, 'public')));




sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });