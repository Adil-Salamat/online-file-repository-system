/* require() will be used to load external npm/node modules. */
/* source() will be used to load local modules written by Team 20 for RepoSearch. */
global.source = name => require(`${__dirname}/${require("./modules.json")[name]}`);

const database = source("database");
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
const uuid = require('uuid/v4');
const connection = source("connection");
const MySQLStore = require('express-mysql-session')(session);

/*Stores sessions in the database.*/
const sessionStore = new MySQLStore({
  clearExpired: true,
  checkExpirationInterval: 30 * 60 * 1000,
  expiration: 30 * 60 * 1000
}, connection);

const { index } = source('index');
const asset = source('asset');
const {addType, addTypeForm} = require('./routes/addType.js');
const {viewAsset, viewAssetForm} = require("./routes/viewAsset.js");
const {editType, editTypePost, deleteType} = require("./routes/type.js");
const {login, logout, loginForm} = source('login');
const {addUser, addUserForm} = source('user');
const {getSystemLogs} = source('logs');
const {profilePage} = source('profile');
const { getLoginLogs } = source('loginLog');
const association = require("./routes/viewAsset.js");
const association_new = source('association');


/*This prevents the back button problem where the previous page could be seen after logout. No caching.*/
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

// Creates a user session when user first enters the site.
app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
    /*console.log(req.sessionID)*/
    return uuid() // use UUIDs for session IDs
  },
  /*visited: Date.now(),*/
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: true, //was false
  saveUninitialized: true //was false
}));

// express.js configs
app.use('/assets/imgs/', express.static('./assets/imgs'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Checks if user is logged in
function loggedIn(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

// checks if user is admin
function adminOnly(req, res, next) {
  if (req.session.access) {
    if (req.session.access == 3) {
      return next();
    }
  }
  res.redirect('/');
}

function properTime(number){
          return number < 10  ? "0" + number : number;
        }
function timeConverter(timestamp){
  let a = new Date(timestamp);
  let year = a.getFullYear();
  let month = properTime(a.getMonth()+1);
  let date = a.getDate();
  let hour = properTime(a.getHours());
  let min = properTime(a.getMinutes());
  let sec = properTime(a.getSeconds());
  let time = year + '-' +  month + '-' + date + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}


app.all('*', function findLastVisit(req, res, next) {
  let userId = req.session.userId;

  let logoutTime = Date.now();
  database.updateLoginLog(userId,timeConverter(logoutTime));
  next()

});




app.get('/login', login);
app.post('/login', loginForm);

app.get('/', loggedIn, index);

app.get('/logout', loggedIn, logout);

app.get('/add', loggedIn, asset.addAsset);
app.post("/add", loggedIn, asset.addAssetForm);

app.get('/assettypes', loggedIn, asset.type.view);

app.get('/addtype', loggedIn, adminOnly, addType);
app.post("/addtype", loggedIn, adminOnly, addTypeForm);

app.get('/edit/:assetID', loggedIn, adminOnly, asset.edit);
app.post("/edit/:assetID", loggedIn, adminOnly, asset.editPost);

app.get('/asset/:assetId', loggedIn, viewAsset);
app.post('/asset/:assetId', loggedIn, viewAssetForm);

app.get('/edittype/:typeID', loggedIn, adminOnly, editType);
app.post("/edittype/:typeID", loggedIn, adminOnly, editTypePost);

app.get('/deletetype/:typeID', loggedIn, adminOnly, deleteType);

app.get('/delete/:assetID', loggedIn, adminOnly, asset.delete);

app.get('/adduser', loggedIn, adminOnly, addUser);
app.post('/adduser', loggedIn, adminOnly, addUserForm);

app.get('/logs', loggedIn, adminOnly, getSystemLogs);

app.get('/loginlogs', loggedIn, adminOnly, getLoginLogs);

app.get('/profile', loggedIn, profilePage);

app.get('/remdepc/:assocId', loggedIn, adminOnly, association.removeDependency);

app.get('/remdepn/:assocId', loggedIn, adminOnly, association.removeDependant);

// Assocaitons page.
app.get('/association', loggedIn, association_new.loadPage);
app.post('/association', loggedIn, association_new.addAssociation);




app.get('*', loggedIn, (req, res) => res.redirect('/'));





app.listen(port, () => console.log(`RepoSearch app listening on port ${port}!`));