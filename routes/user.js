/* Imports */
const database = source("database");
const idGen = source("idGen");
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
* Generates the page for creating users.
* 
* @param  {} req - request variable
* @param  {} res - response variable
* @param  {} message - any message to be displayed on the page
*/
function generate(req, res, message) {
  res.render('addUser.ejs', {
    title: "Add User",
    logged: req.session.user,
    access: req.session.access,
    message
  });
}

module.exports = {
  
  /**
  * 
  * Generates the  user page. 
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */
  addUser: (req, res) => {
    generate(req, res, null)
  },
  
  /**
  * Routing for once the user submits a form. Inputs data into the database.
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */
  addUserForm: (req, res) => {
    
    let id = idGen.new();
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let access = req.body.access;
    let userId = req.session.user;
    
    database.addSystemLog(id, username, "added", userId, "user");
    
    /* Encrypts the password using multiple rounds of hashing and salting. */
    bcrypt.hash(password, saltRounds).then((hash) => {
      database.user.add(id, email, username, hash, access).then(() => {
        generate(req, res, `User ${username} Added!`); 
      }).catch(err => console.log(err));
    });
  },
  
  /**
  * Routing for if the user clicks to delete an account.
  *
  * @param  {} req - request variable
  * @param  {} res - response variable
  */
  deleteUser: (req, res) => {
    database.deleteUser(req.body.userId).then(() => {
      generate(req, res, null);
    });
  }
};
