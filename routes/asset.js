const database = source("database");
const idGen = source("idGen");

/**
 * Generates the page for viewing assets.
 *
 * @param  {} req - request variable
 * @param  {} res - res variable
 * @param  {} message - any message to be displayed on the page
 */
function generate(req, res, message) {
  database.fetchTypeAttributes().then(result => {
    res.render('addAsset.ejs', {
      title: "Add Asset",
      types: result,
      logged: req.session.user,
      access: req.session.access,
      message
    });
  }).catch(err => console.log(err));
}


function generateViewTypes(req, res, message) {
  database.asset.type.all().then(type_list => {
    console.log(type_list);
  });
}


module.exports = {

  addAsset: (req, res) => generate(req, res, null),

  addAssetForm: (req, res) => {

    let asset_id = idGen.new();
    let asset_name = req.body.assetName;
    let type_id = req.body.typeSelect;
    let dataArray;
    let value;
    var index = 0;
    let userId = req.session.user;
    
  
    database.insertAsset(asset_id, asset_name, type_id)
    .then(() => {
      generate(req, res, null); 
      database.fetchTypeAttributes().then(result => {
        result.forEach(e => {
          if (e.id === type_id) {
            dataArray = e.attribute_id;
            value = req.body[dataArray];
            index++;
            database.insertAssetData(asset_id, dataArray, value);
          }
        });
      }).catch(err => console.log(err));
      database.addSystemLog(asset_id, asset_name, "added", userId, "asset");

    })
    .catch(err => console.log(err));
  },

  delete: (req, res) => {
    let asset_id = req.params.assetID;
    let id = req.params.assetID;
    let userId = req.session.user;

    res.redirect('/');
    console.log(req.body);
    database.asset.get(asset_id).then(result => {
      database.addSystemLog(asset_id, result[0].asset_name, "deleted", userId, "asset");
    });


    
    database.asset.delete(id);
  },

  edit: (req, res) => {
    let id = req.params.assetID;
    

    
    database.asset.get(id).then(meta => {
      database.asset.data(id).then(data => {
        res.render('editAsset.ejs', {
          title: "Edit Asset",
          meta: meta,
          data: data,
          logged: req.session.user,
          access: req.session.access
        });
      });
    });

  },

  editPost: (req, res) => {
    console.log(req.body);
    let asset_id = req.params.assetID;
    let userId = req.session.user;


    console.log(req.params.asset);



    for (let id in req.body) {
      // if (!req.body.hasOwnProperty(id)) continue; //might be needed incase of bugs. 

      let val = req.body[id];

      database.asset.alterAttr(req.params.assetID, id, val);

    }
    database.asset.get(asset_id).then(result => {
      database.addSystemLog(asset_id, result[0].asset_name, "edited", userId, "asset");
    });

    res.redirect(`/edit/${asset_id}`);

  },


  type: {
    view: (req, res) => {
      database.asset.type.all().then(result => {
        database.fetchTypeAttributes().then(result2 => {
          res.render('viewAssetTypes.ejs', {
            title: "Asset Types",
            types: result,
            attributes: result2,
            logged: req.session.user,
            access: req.session.access
          });
        });
      });
    }
  }

}
