/**
* This file is an extension of the database api for association tables.
*
* @see database.js
*/
const connection = source("connection");


function process(sqlQuery) {
  return new Promise(function (resolve, reject) {
    connection.query(sqlQuery, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      } else if (res[0]) {
        resolve(res);
      } else {
        resolve(null);
      }
    });
  }).catch(err => console.log(err));
}


module.exports = { 
  
  association: {
    
    // This deals with interacting with data based off the id of a single asset. uses: viewAsset page, etc.
    asset: {
      
      // Selects all the assocaitons that the asset is a member of, either as asset a or b. Also takes the name of the association. 
      partOf: (id) => {
        return process(`
        SELECT *
        FROM association_pair, association_info, association_type, asset AS asset_a, asset AS asset_b
        WHERE association_pair.association_id = association_info.association_id
        AND association_pair.asset_a_id = asset_a.asset_id
        AND association_pair.asset_b_id = asset_b.asset_id
        AND association_info.association_type_id = association_type.association_type_id
        AND association_pair.asset_a_id="${(id)}"
        OR association_pair.asset_b_id="${(id)}"`);
      },
    },
    
    pair: {
      
      insert: (a, b, id) => {
        return process(`INSERT INTO association_pair VALUES ("${(a)}",
        "${(b)}",
        "${(id)}")`);
      },
      
      select: (id) => {
        return process(`SELECT * FROM association_pair WHERE association_id="${(id)}"`);
      },
      
    },
    
    info: {
      insert: (id, n, a, t) => {
        return process(`INSERT INTO association_info VALUES ("${id}", "${n}", "${a}", "${t}")`);
      },
      
      select: (id) => {
        return process(`SELECT * FROM association_info WHERE association_id="${(id)}"`);
      },
      
      selectAll: () => {
        return process(`
        SELECT * FROM association_info, association_type
        WHERE association_info.association_type_id = association_type.association_type_id
        `);
      },
    },
    
    type: {
      
      insert: (id, n, a, r, i) => {
        return process(`INSERT INTO association_type VALUES ("${i}","${n}", "${a}", "${r}","${i}")`);
      },
      
      select: (id) => {
        return process(`SELECT * FROM association_type WHERE association_type_id="${(id)}"`);
      },
      
      selectAll: () => {
        return process(`SELECT * FROM association_type`);
      },
      
    },
  },
  
  
  
}