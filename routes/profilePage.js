const database = source("database");
const idGen = source("idGen");
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Generates the profile page of the user
 *
 * @param  {} req - request variable
 * @param  {} res - res variable
 * @param  {} message - any message to be displayed on the page
 */
function generate(req, res, message) {

  database.user.get(req.session.userId).then(result => {
    res.render('profilePage.ejs', {
      title: "Profile Page",
      logged: req.session.user,
      access: req.session.access,
      user: result,
      message
    });
  });

  
}

module.exports = {
  /**
  * Generates the  profile page 
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */
  profilePage: (req, res) => generate(req, res, null),

  /**
  * Routing for once the user submits a form. Inputs user information into the database.
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */
  changePasswordForm: (req, res) => {

    let id = idGen.new();
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let access = req.body.access;

    bcrypt.hash(password, saltRounds).then((hash) => {
      database.insertUser(id, email, username, hash, access).then(() => {
        generate(req, res, `User ${username} Added!`); 
      }).catch(err => console.log(err));
    });
  },

  // deleteUser: (req, res) => {
  //   let id = req.body.userId;

  //   database.deleteUser(id).then(() => {
  //     generate(req, res, null);
  //   });
  // }


};
