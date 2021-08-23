const database = source("database");
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
  * Generates login page.
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  * @param  {} message - any message to be displayed on the page
  */
function generate(req, res, message) {
  res.render('login.ejs', {
    title: "Login",
    logged: req.session.user,
    access: req.session.access,
    message
  });
}

module.exports = {
  /**
   * Description
   * @param  {} req - request variable
   * @param  {} res - response variable
   * @param  {} message - any message to be displayed on the page
   */
  login: (req, res) => {
    if (req.session.user) {
      return res.redirect('/');
    }
    generate(req, res, null);
  },

  /**
  * Routing for once the user submits a form. Compares user-typed login credentials with ones in database. Inputs data into the database.
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */
  loginForm: (req, res) => {

    if (req.session.user) {
      return res.redirect('/');
    }

    let username = req.body.user;
    let password = req.body.password;
    let uniqueId = req.sessionID;

    
    database.user.getByName(username).then(user => {
      if (!user) {
        return generate(req, res, 'Wrong Username or Password.');
      }


      bcrypt.compare(password, user[0].password).then(function(check) {
        if (check) {
          req.session.user = user[0].username;
          req.session.access = user[0].access;
          req.session.userId = user[0].user_id;
          let userId = req.session.userId;


          database.addLoginLog(userId);
          res.redirect('/');

        } else {
          generate(req, res, 'Wrong Username or Password.');
        }
      });
    });
  },

  /**
   * Clears the session of the user and inputs logout time into the database
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  logout: (req, res) => {

    if (!req.session) {
      res.redirect('/');
    } else if (!req.session.user) {
      res.redirect('/');
    } else {
      let userId = req.session.userId;
      database.addLogoutLog(userId);
      req.session.user = null;
      req.session.access = null;
      res.redirect('/login');
    }
  }
};