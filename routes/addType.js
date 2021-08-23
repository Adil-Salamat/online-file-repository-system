const database = source("database");
const idGen = source("idGen");
const connection = source("connection");

/**
* Generates the page for adding types.
* 
* @param  {} req - request variable
* @param  {} res - response variable
* @param  {} message - any message to be displayed on the page
*/
function generate(req, res, message) {
  res.render('addType.ejs', {
    title: "Add Type",
    logged: req.session.user,
    access: req.session.access,
    message
  })
}

module.exports = {

  /**
  * 
  * Generates the page for adding types. 
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */
  addType: (req, res) => {
    generate(req, res, null); 
  },

  /**
  * Routing for once the user submits a form. Inputs data into the database.
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */
  addTypeForm: (req, res) => {

    console.log(req.body);
    let message = '';
    let typeID = "";
    let attributeID = "";
    let typeName = req.body.type;
    let var_type;
    let desc;
    let attributeName;
    let index = parseInt(req.body.index);
    let userId = req.session.user;

    database.selectType(typeID)
    .then(result => {
      generate(req, res, null);
      if(result) {
        console.log("THAT TYPE ALREADY EXISTS");
      } else {
        typeID = idGen.new();
        database.addSystemLog(typeID, typeName, "added", userId, "type");
        database.insertType(typeID, typeName)
        .then(() => {
          for(var i = 1; i < index + 1; i++) {
            attributeID = idGen.new();

            let key = `attributeVariableType${i}`;
            var_type = req.body[key];

            key = `attributeDescription${i}`;
            desc = req.body[key];

            key = `attributeName${i}`;
            attributeName = req.body[key];

            console.log("Inserting to databse:" + attributeName);

            database.insertAttribute(typeID, attributeID, var_type, desc, attributeName);
          }
        });
      }
    })
    .catch(err => console.log(err));
  },
}
