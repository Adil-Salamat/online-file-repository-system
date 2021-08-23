const database = source("database");

module.exports = {

  /**
   * Fetches information from database and then generates page of the tracking activity of the users
   * @param  {} req - request variable
   * @param  {} res - response variable
   */
  getSystemLogs: (req, res) => {
    
    database.getLogs().then(results => {
      console.log(results);
      res.render('systemLogs.ejs', {
        title: "View User History",
        logs: results,
        logged: req.session.user,
        access: req.session.access
      });
    });	
  }
}