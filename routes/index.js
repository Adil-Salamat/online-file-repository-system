const database = source("database");

module.exports = {

/**
  * index - fetches information from database and then generates the main page for viewing all asets
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */

  
	index: (req, res) => {
    database.assetJoinTypeAll().then(results => {
      res.render('index.ejs', {
        title: "View Assets",
        assets: results,
        logged: req.session.user,
        access: req.session.access
      });
    });
  }
};