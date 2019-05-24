//Starting express framework server
const express = require('express');
const app = express();
app.listen(3001, () => { console.log(`Connected to the server`) });

//importing cookie-parser module for interacting between frontend nd backend
const cookie = require('cookie-parser');

//importing express-session module for authentication purpose
const session = require('express-session');

//importing request module for making api request from node
const Request = require('request');
const uri = "http://localhost:3001";

//importing extra modules needed
const bodyparser = require('body-parser');
const path = require('path');

//Connecting to mongodb
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/BookStore", { useNewUrlParser: true });
mongoose.connection
    .once('open', () => { console.log(`Connected to the Database`) })
    .on('error', (err) => { console.log(`Cannot Connect to Database. Error: ${err}`) });

//setting options using app
 app.set('views', [__dirname + path.join('/views/adminmodule'),
 __dirname + path.join('/views/guestmodule'),
 __dirname + path.join('/views/usermodule')]);

// bodyParser middleware
app.use(bodyparser.json());

//cookie-parser middleware
app.use(cookie());

//express-session middleware
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:"Hey There it is the book store"
}))

//mentioning not to save cookies and all everytym it should do a new refresh
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

//defining static paths for js/cssand images if any
app.use('/js',express.static(__dirname+path.join('/public/js')));
app.use('/css',express.static(__dirname+path.join('/public/css')));
app.use('/images',express.static(__dirname+path.join('/public/images')));

//using router middleware
app.use('/bookapi', require('./controllers/api/BooksCollectionApi'));
app.use('/userapi', require('./controllers/api/UserCollectionApi'));
app.use('/cityapi', require('./controllers/api/CitiesCollectionApi'));
app.use('/guest', require('./controllers/guestaccount/GuestAccountRouter'));
app.use('/user',require('./controllers/useraccount/UserAccountRouter'));

// //raw stuff
// app.get('/', function (request, response) {
//     request.session.cookie.domain.
//     response.end();
// })

app.get('/home/:id', function (request, response) {
    Request.get(`/api/getbook/${request.params.id}`, function (err, res, body) {
        response.send(`${JSON.stringify(res.body)}`);
    });
    Request.post()
})