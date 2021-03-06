const database = source("database");
const database_assoc = source("database_association");
const idGen = source("idGen");

/*Debugging*/
const util = require('util');

/**
* Fetches neccessary data from database and renders the page for viewing detailed information about the asset.
* 
* @param  {} req - request variable
* @param  {} res - response variable
* @param  {} message - any message to be displayed on the page
*/
function generate(req, res, message) {
  
  let assetId = req.params.assetId;
  
  
  
  database.assetJoinTypeAll().then(assets => {
    database.association.dependency.get(assetId).then(depends => {
      database.assetAttributeValues(assetId).then(result => {
        database.association.dependant.get(assetId).then(depns => {
          
          
          database_assoc.association.asset.partOf(assetId).then(assocList => {
            
            
            console.log(assocList);
            
            database_assoc.association.info.selectAll().then(assocAll => {
              database.fetchComments(assetId).then(fetchComment =>{
                
                res.render('viewAsset.ejs', {
                  title: `${result[0].asset_name} | Asset`,
                  assetId: null,
                  comments: fetchComment,
                  attribs: result,
                  logged: req.session.user,
                  access: req.session.access,
                  depens: depends,
                  asset: assets,
                  depns: depns,
                  assocList,
                  assocAll,
                  message
                });
              });
            });
            
          });
          
          
        });
      });
    });
  });
}

module.exports = {
  /**
  * 
  * Generates the page for viewing an asset. 
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */
  viewAsset: (req, res) => {
    
    generate(req, res, null);
  },
  
  
  /**
  * Routing for once the user submits a form. Inputs data into the database.
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */ 
  viewAssetForm: (req, res) => {
    
    let assetId = req.params.assetId;
    let userId = req.session.userId;
    
    if (req.body.comments) {
      let text = req.body.comments;
      let commentId = idGen.new();
      
      database.insertComment(userId,text, commentId, assetId).then(generate(req, res, null));
      
    } else if (req.body.dep) {
      
      let id = req.body.dep;
      
      /*Server side check for duplicate dep rels, incase of client side modification of html (hack).*/
      database.association.dependency.get(assetId).then(r => {
        if (r) {
          if (r.asset_dependency_id == id) {
            return generate(req, res, "This dependency relation already exists.");
          }
        } 
        
        let new_id = idGen.new();
        database.association.dependency.add(id, assetId, new_id).then(generate(req, res, null));
        
      });
      
    } else if (req.body.assoc_asset) {
      let assetA = req.params.assetId;
      let assetB = req.body.assoc_asset;
      let assoc = req.body.assoc_assoc;
      
      database_assoc.association.pair.insert(assetA, assetB, assoc);
      
      generate(req, res, "Successfuly added asset to associtation.");
    } else {
      generate(req, res, null);
    }
    
    
    
  },
  
  /**
  * Deletes the dependency
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */ 
  removeDependency: (req, res) => {
    let id = req.params.assocId;
    
    database.association.get(id).then(a => {
      
      database.association.dependency.remove(id);
      
      req.params.assetId = a[0].asset_dependant_id;
      
      res.redirect(`/asset/${a[0].asset_dependant_id}`);
      
      
      generate(req, res, "Dependency removed.");
    });
  },
  
  /**
  * Deletes the dependent
  * 
  * @param  {} req - request variable
  * @param  {} res - response variable
  */ 
  removeDependant: (req, res) => {
    let id = req.params.assocId;
    
    database.association.get(id).then(a => {
      
      database.association.dependency.remove(id);
      
      req.params.assetId = a[0].asset_dependency_id;
      
      
      res.redirect(`/asset/${a[0].asset_dependency_id}`);
      
      generate(req, res, "Dependant removed.");
      
    });
    
  },
  
  
  
}