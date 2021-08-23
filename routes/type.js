const database = source("database");
const idGen = source("idGen");

module.exports = {
  /**
  * Fetches information from database and then generates a page for editing types .
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */
  editType: (req, res) => {
    let id = req.params.typeID;
    
    database.asset.type.get(id).then(types => {
      database.asset.type.attrs(id).then(attributes => {
        res.render('editType.ejs', {
          title: "Edit Type",
          types: types,
          attributes: attributes,
          logged: req.session.user,
          access: req.session.access
        });
      });
    });

  },

  /**
  * Routing for once the user submits a form. Edits the attributes and  inputs them into the database.
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */

  editTypePost: (req, res) => {
    let type_id = req.params.typeID;
    let index;
    let attribute_id = "";
    console.log(req.body);
    for(let key in req.body) {
      console.log(key);
    }
    
    database.asset.type.countAtt(type_id).then(count => {
      index = count[0].attributeCount;
      //console.log(index);
      //console.log(count[0].attributeCount);

      database.asset.type.attrs(type_id).then(data => {
        let key1, key2, key3;
        for (let i = 0; i < index; i++) {
          console.log("Index = " + i + ", Value = " + req.body[`delete-switch${i}`])
          if(req.body[`delete-switch${i}`]) {
            console.log("DELETION REQUEST");
          }
          else {
            console.log("UPDATE REQUEST");
          }
          if (req.body[`delete-switch${i}`]) {
            database.asset.type.attrDelete(data[i].attribute_id);
          }
          else {
            key1 = `name${i}`;
            key2 = `variableType${i}`;
            key3 = `description${i}`;

            console.log("Attribute ID: " + data[i].attribute_id);
            console.log(data[i].attribute_name + " to be replaced by: " + req.body[key1]);
            console.log(data[i].variable_type + " to be replaced by: " + req.body[key2]);
            console.log(data[i].description + " to be replaced by: " + req.body[key3]);

            database.asset.type.changeAttr(req.body[key1], req.body[key2], req.body[key3], data[i].attribute_id);
          }
        }
        let upCount = 1;
        for (let key in req.body) {
          if (key == "newAttributeName" + upCount) {
            console.log("SUCCESS");
            attribute_id = idGen.new();
            database.insertAttribute(type_id, attribute_id, req.body[`newAttributeType` + upCount], req.body[`newAttributeDescription` + upCount], req.body[`newAttributeName` + upCount]);

            upCount++;
          }
        }
      });
    });
    res.redirect(`/edittype/${type_id}`);
  },

  //Needs to be updated to follow the archiving of assets
  deleteType: (req, res) => {
    let type_id = req.params.typeID;

    res.redirect('/assettypes/');
    database.asset.type.delete(type_id);
  },
}
