const database = source("database");

module.exports = {
  
  /**
  * getLoginLogs - fetches information from database and then generates page for viewing asset, user and type history.
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */
  getLoginLogs: (req, res) => {
    database.getLoginLogs().then(results => {     
      res.render('loginLog.ejs', {
        title: "View Login Logs",
        logs: results,
        logged: req.session.user,
        access: req.session.access
      });
    });
  }	
}
