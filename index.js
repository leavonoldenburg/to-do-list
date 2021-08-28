const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const hbs = require('hbs');
const Item = require('./models/item');
const mongoose = require('mongoose');
const { response } = require('express');
const nodeSassMiddleware = require('node-sass-middleware');
const serveFavicon = require('serve-favicon');
const app = express();

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(serveFavicon(path.join(__dirname, 'public/favicon.ico')));
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(
  nodeSassMiddleware({
    dest: path.join(__dirname, 'public/styles'),
    src: path.join(__dirname, 'styles'),
    force: true,
    outputStyle: 'expanded',
    prefix: '/styles'
  })
);
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response, next) => {
  Item.find({})
    .then((item) => {
      response.render('home', { item });
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/create-to-do-list-item', (request, response, next) => {
  console.log(request.body);
  const title = request.body.item;
  Item.create({
    title: title
  })
    .then((item) => {
      response.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/delete', (request, response, next) => {
  console.log(request.body);
  const id = request.body.id;
  Item.findByIdAndDelete(id)
    .then((item) => {
      response.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/edit', (request, response, next) => {
  console.log(request.body);
  const id = request.body.id;
  const title = request.body.item;
  Item.findByIdAndUpdate(id, { title: title })
    .then((item) => {
      response.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/error', (request, response) => {
  response.render('error');
});

app.get('*', (request, response) => {
  response.render('error');
});

app.use((error, request, response, next) => {
  response.render('error');
});

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI).then(() => {
  app.listen(3000);
});
