/** 
 *This file is an api used to store all sql queries used throughout the project as functions.
 */

/**
 *connection creates a connection between this js file and our database. 
 */
const connection = source("connection");

/**
 *process is a function that executes the sql queries and returns the requested parameters.
 *@param sqlQuery - the query to be executed
 *@return new Promise(function(resolve, reject)
 */
function process(sqlQuery) {

  return new Promise(function(resolve, reject) {
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

// is used on every input to prevent any malicious user from injecting sql queries.
module.exports = {  

  /*Handles the tables involved in association*/
  association: {

    get: (id) => {
      return process(`SELECT * FROM dependency WHERE association_id="${(id)}"`);
    },

    /*Handles the dependency table*/
    dependency: {

      get: (id) => {
        return process(`
          SELECT * 
          FROM dependency, asset
          WHERE dependency.asset_dependant_id="${(id)}" 
          AND dependency.asset_dependency_id=asset.asset_id`);
      },

      add: (dependency, parent, id) => {
        return process(`
          INSERT INTO dependency 
          VALUES ("${(dependency)}", 
          "${(parent)}", 
          "${(id)}")`);
      },

      remove: (id) => {
        return process(`DELETE FROM dependency WHERE association_id="${(id)}")`);
      },

    },

    
    fetchAll: () => {
      return process(`SELECT * FROM association`);
    },

    /**
     * Fetches all data from association table based on id of the relation
     * @param  {} id - id of the relation
     * @return {}    [description]
     */
    fetch: (id) => {
      return process(`SELECT * FROM association WHERE relation_id="${(id)}"`);
    },

    /**
     * Fetches all data from association_meta table 
     * @return {} [description]
     */
    fetchMetaAll: () => {
      return process(`SELECT * FROM association_meta`);
    },

    /**
     * Fetches all data from association_meta table based on id of the relation
     * @param  {} id - id of the relation
     * @return {}    [description]
     */
    fetchMeta: (id) => {
      return process(`SELECT * FROM association_meta WHERE relation_id="${(id)}"`);
    },

    /**
     * Inserts passed parameters into association_meta table
     * @param  {} id   - id of the association
     * @param  {} name - name of the association
     * @param  {} desc - description of the association
     * @param  {} type - type of the association
     * @return {}      [description]
     */
    insertMeta: (id, name, desc, type) => {
      return process(`INSERT INTO association_meta 
        VALUES ("${(id)}", 
        "${(name)}", 
        "${(desc)}", 
        "${(type)}")`);
    },


    /**
     * Fetches all data from dependency table
     * @return {} [description]
     */
    fetchAll: () => {
      return process(`SELECT * FROM dependency`);
    },

    /**
     * Fetches all data from dependency table based on id of the association
     * @param {} id - id of the association
     */
    fetch: (id) => {
      return process(`SELECT * FROM dependency WHERE association_id="${(id)}"`);
    },

    
    insertDependency: (dependecy_id, depenedent_id, association_id) => {
      return process(`INSERT INTO dependency 
        VALUES ("${(dependecy_id)}", 
        "${(depenedent_id)}", 
        "${(association_id)}")`);
    },


    /*Handles the dependant table*/
    dependant: {
      /**
       * Fetches all data from dependenct and asset tables based on the id of dependency and id the of asset
       * @param  {} id - id of the dependency
       * @return {}    [description]
       */
      get: (id) => {
        return process(`
          SELECT * 
          FROM dependency, asset
          WHERE dependency.asset_dependency_id="${(id)}"
          AND dependency.asset_dependant_id=asset.asset_id
          `);
      },

      /**
       * Deletes data from dependency table based on id of the association
       * @param  {} id - id of the associaiton
       * @return {}    [description]
       */
      remove: (id) => {
        return process(`DELETE FROM dependency WHERE association_id="${(id)}"`);
      },

    /**
     * Fetches all data from dependency table
     * @return {} [description]
     */
      fetchAll: () => {
        return process(`SELECT * FROM dependency`);
      },

      /**
     * Fetches all data from dependency table based on id of the association
     * @param {} id - id of the association
     */
      fetch: (id) => {
        return process(`SELECT * FROM dependency WHERE association_id="${(id)}"`);
      },

      /**
     * Inserts passed paraemters into dependancy talbe
     * @param  {} dependecy_id   - id of the dependency
     * @param  {} depenedent_id  - id of the dependent  
     * @param  {} association_id - id of the association
     * @return {}                [description]
     */
      insertDependency: (dependecy_id, depenedent_id, association_id) => {
        return process(`INSERT INTO dependency 
          VALUES ("${(dependecy_id)}",
          "${(depenedent_id)}",
          "${(association_id)}")`);
      },

    },

    /*This db object deals with the `group` and `group_meta` db tables.*/
    group: {
    /**
     * Fetches all data from association table
     * @return {} [description]
     */
      fetchAll: () => {
        return process(`SELECT * FROM group`);
      },

    /**
     * Fetches all data from group table based on the id of the asset
     * @return {} [description]
     */
      fetch: (id) => {
        return process(`SELECT * FROM group WHERE asset_id="${(id)}"`);
      },

      /**
       * Inserts passed parameters to group_id table based on id's of the asset and group
       * @param  {} asset_id [description]
       * @param  {} group_id [description]
       * @return {}          [description]
       */
      insert: (asset_id, group_id) => {
        return process(`INSERT INTO group_id 
          VALUES ("${(asset_id)}", 
          "${(group_id)}")`);
      },

    /**
     * Fetches all data from group_meta table
     * @return {} [description]
     */
      fetchMetaAll: () => {
        return process(`SELECT * FROM group_meta`);
      },

    /**
     * Fetches all data from group_meta table based on the id of the asset
     * @return {} [description]
     */
      fetchMeta: (id) => {
        return process(`SELECT * FROM group_meta WHERE group_id="${(id)}"`);
      },

      /**
       * Insert passed paramaters to the group_id table
       * @param  {} group_name - name of the group
       * @param  {} group_id   - id of the group
       * @param  {} desc       - user-typed description
       * @return {}            [description]
       */
      insertMeta: (group_name, group_id, desc) => {
        return process(`INSERT INTO group_id 
          VALUES ("${(group_name)}", 
          "${(group_id)}",
          "${(desc)}")`);
      },
    },

    /*This db object deals with the `parent_child` db table.*/
    parentChild: {
      /**
     * Fetches all data from association table
     * @return {} [description]
     */
      fetchAll: () => {
        return process(`SELECT * FROM parent_child`);
      },

     /**
     * Fetches all data from group table based on the id of the group
     * @return {} [description]
     */
      fetch: (id) => {
        return process(`SELECT * FROM parent_child WHERE group_id="${(id)}"`);
      },

       /**
       * [description]
       * @param  {} group_name - name of the group
       * @param  {} group_id   - id of the group
       * @param  {} desc       - user-typed description
       * @return {}            [description]
       */
      insert: (group_name, group_id, desc) => {
        return process(`INSERT INTO parent_child VALUES ("${(group_name)}",
          "${(group_id)}",
          "${(desc)}")`);
      },

    },

  },

  /* For asset and asset_data tables. */
  asset: {

    
    /**
     * Fetches all data from dependenct and asset tables based on the id of dependency and id the of asset
     * @param  {} id - id of the aset
     * @return {}    [description]
     */
    get: (id) => {
      return process(`SELECT * FROM asset WHERE asset_archived="0" AND asset_id="${(id)}"`);
    },

    /**
     * Fetches all data from asset table based on asset_archived 
     * @return {} [description]
     */
    all: () => {
      return process(`SELECT * FROM asset WHERE asset_archived="0"`);
    },

    /**
       * Fetches all data from dependenct and asset tables based on the id of the asset and attribute
       * @param  {} id - id of the asset
       * @return {}    [description]
       */
    data: (id) => {
      return process(`
        SELECT * FROM asset_data, type_attribute 
        WHERE asset_id="${(id)}"
        AND asset_data.attribute_id = type_attribute.attribute_id`);
    },

    /**
     * Alters table with passed paramaters
     * @param  {} asset_id     id of the asset
     * @param  {} attribute_id id of the attribute
     * @param  {} value        user-typed value
     * @return {}              [description]
     */
    alterAttr: (asset_id, attribute_id, value) => {
      return process(`
        UPDATE asset_data 
        SET value="${(value)}"
        WHERE asset_id="${(asset_id)}"
        AND attribute_id="${(attribute_id)}"`);
    },

    /**
     * Alters asset_archived from asset table based on id of the association to mask the asset
     * @param  {} id - id of the associaiton
     * @return {}    [description]
     */
    delete: (id) => {
      return process(`UPDATE asset SET asset_archived="1" WHERE asset_id="${(id)}"`);
    },

    /**
     * Restore an asset based on the id of the asset
     * @param  {} id  id of the asset
     * @return {}    [description]
     */
    restore: (id) => {
      return process(`UPDATE asset SET asset_archived="0" WHERE asset_id="${(id)}"`);
    },

    /* For assettype and asset type atribs tables. */
    type: {
      /**
       * Fetches all data from type table based on the id of type
       * @param  {} id - id of the type
       * @return {}    [description]
       */
      get: (id) => {
        return process(`SELECT * FROM type WHERE type.id="${id}"`);
      },

      /**
       * Fetches all data from type table
       * @return {} [description]
       */
      all: () => {
        return process(`SELECT * FROM type`);
      },

      /**
       * Fetches all data from type_attribute table based on the id of the type
       * @param  {} id - id of the type
       * @return {}    [description]
       */
      attrs: (id) => {
        return process(`SELECT * FROM type_attribute WHERE type_id="${(id)}"`);
      },

      /**
       * Fetches all data from type table and type_attribute tables based on the id of the type
       * @return {} [description]
       */
      all2: () => {
        return process(`SELECT * FROM type, type_attribute WHERE type.id=type_attribute.type_id`);    
      },

      /**
       * Amount of the attributes based on the id of the type
       * @param  {} id - id of the type
       * @return {}    [description]
       */
      countAtt: (id) => {
        return process(`SELECT COUNT(*) AS attributeCount FROM type_attribute WHERE type_id="${(id)}"`);
      },

      /**
       * Alters the type_attribute table with passed parameters
       * @param  {} name        - name of the attribute
       * @param  {} type        - type of the attirubte
       * @param  {} description - user-typed description
       * @param  {} attr_id     - id of the attribute
       * @return {}             [description]
       */
      changeAttr: (name, type, description, attr_id) => {
        return process(`UPDATE type_attribute SET attribute_name="${(name)}", variable_type="${(type)}", description="${(description)}" WHERE attribute_id="${(attr_id)}"`);
      },

      /**
       * Deletes data from type_attribute table based on id of the attribute
       * @param  {} id - id of the attribute
       * @return {}    [description]
       */
      attrDelete: (id) => {
        return process(`DELETE FROM type_attribute WHERE attribute_id="${(id)}"`);
      },

      /**
       * Deletes data from type table based on id of the type
       * @param  {} id - id of the type
       * @return {}    [description]
       */
      delete: (id) => {
        return process(`DELETE FROM type WHERE id="${(id)}"`);
      },
    },

  },

  /* For user tables. */
  user: {

    /**
     * Fetches all data from user table based on its id
     * @param  {} id - id the of user
     * @return {}    [description]
     */
    get: (id) => {
      return process(`SELECT * FROM user WHERE user_id="${(id)}"`);
    },

    /**
     * Fetches all data from user table based on username
     * @param  {} name - username
     * @return {}      [description]
     */
    getByName: (name) => {
      return process(`SELECT * FROM user WHERE username="${(name)}"`);
    },

    /**
     * Inserts into user table passed parameters
     * @param  {} id     - id of the user
     * @param  {} email  - email of the user
     * @param  {} user   - username of the user
     * @param  {} pass   - password of the user
     * @param  {} access - access level of the user
     * @return {}        [description]
     */
    add: (id, email, user, pass, access) => {
      return process(`INSERT INTO user 
        VALUES ("${(id)}",
        "${(email)}",
        "${(user)}",
        "${(pass)}",
        "${(access)}")`);
    }, 

    /**
     * Alters  user table with passed parameters
     * @param  {} id     - id of the user
     * @param  {} email  - email of the user
     * @param  {} user   - username of the user
     * @param  {} pass   - password of the user
     * @param  {} access - access level of the user
     * @return {}        [description]
     */
    update: (id, email, user, pass, access) => {
      return process(`UPDATE user 
        SET user_id=${(id)},
        email=${(email)},
        username=${(user)},
        password=${(pass)},
        access=${(access)})`);
    }, 

    /**
     * Fetches all data from user table
     * @return {} [description]
     */
    all: () => {
      return process(`SELECT * FROM user`);
    }
    
  },

  /**
   * Fetches all data from assetTypes table
   * @return {} [description]
   */
  fetchTypes: () => {
    return process(`SELECT * FROM assetTypes`);
  },

  /**
   * Fetches all data from assetTypes table based on the asset of the type
   * @return {} [description]
   */
  fetchType: (id) => {
    return process(`SELECT * FROM assetTypes WHERE typeID="${(id)}"`);
  },

  /**
   * Fetches all data from type table and type_attribute tables based on the id of the type
   * @return {} [description]
   */
  fetchTypeAttributes: () => {
    return process(`
      SELECT type.id, type.name, type_attribute.attribute_id, type_attribute.variable_type, type_attribute.description, type_attribute.attribute_name 
      FROM type, type_attribute 
      WHERE type.id = type_attribute.type_id`);
  },

  /**
   * Fetches all data from assocNames table
   * @return {} [description]
   */
  fetchAssocs: () => {
    return process(`SELECT * FROM assocNames`);
  },

  /**
   * Fetches all data from assocNames table based on the id of the association and association name
   * @return {} [description]
   */
  fetchAssoc: (id) => {
    return process(`SELECT * FROM assoc WHERE assocName="${(id)}" OR assocID="${(id)}"`);
  },

  /**
   * Fetch all coments based on the id of the asset and id of the user
   * @param  {} id - id of the comment
   * @return {}    [description]
   */
  fetchComments: (id) => {
   return process(`SELECT user.username, comment.comment, comment.date FROM comment,user WHERE assetID="${id}" AND user.user_id=comment.userID `);
  },

  /**
   * Inserts passed paramaters to the comment table
   * @param  {} userId  - id of the user
   * @param  {} text    - user-typed comment
   * @param  {} comId   - id of the comment
   * @param  {} assetId - id of the asset
   * @return {}         [description]
   */
  insertComment: (userId,text, comId, assetId) => {
    return process(`INSERT INTO comment (userID, comment, commentID, assetID,date)
      VALUES ("${(userId)}",
      "${(text)}",
      "${(comId)}",
      "${(assetId)}",
      NOW())`);
  },

  /**
   * Inserts passed paramaters to the systemlogs table with current time
   * @param  {} id          - id of the object
   * @param  {} name        - name of the object
   * @param  {} logTypeCode - description of the action to the object(delete, edit, add)
   * @param  {} userID      - id of the user
   * @param  {} obj         - the type of the object(user,type,asset)
   * @return {}             [description]
   */
  addSystemLog: (id, name, logTypeCode, userID, obj) => {
    return process(`INSERT INTO systemLogs (assetID, assetName, logTypeID, userID, object, created) 
      VALUES ("${(id)}",
      "${(name)}",
      (SELECT id FROM logTypes WHERE code ="${(logTypeCode)}"),
      "${(userID)}",
      "${(obj)}",
      NOW())`);
  },

  /**
   * Inserts login time of the current user to the loginLogs table 
   * @param  {} userID  - id of the user
   * @return {}        [description]
   */
  addLoginLog: (userID) => {
    return process(`INSERT INTO loginLogs (userID, loginTime) 
      VALUES ("${(userID)}",
      NOW())`);
  },

  /**
   * Inserts logout time of the current user to the last row of the loginLogs table 
   * @param  {} userID [description]
   * @return {}        [description]
   */
  addLogoutLog: (userID) => {
    return process(`UPDATE loginLogs SET logoutTime=NOW() WHERE loginLogs.userID="${(userID)}" order by id desc LIMIT 1 `);
  },

  /**
   * Alters the table's last row  with passed paramaters
   * @param  {} userId    - id of the user
   * @param  {} lastVisit - time of the last activity of the user
   * @return {}           [description]
   */
  updateLoginLog:(userId,lastVisit)  => {
    return process(`UPDATE loginLogs
      SET loginLogs.logoutTime="${(lastVisit)}"
      WHERE loginLogs.userID="${(userId)}"
      order by id desc LIMIT 1`);
  },





  /**
   * Fetches name of the attribue from type_attribute table based on the id of the asset and type
   * @param  {} id - id of the asset
   * @return {}    [description]
   */
  assetAttribs: (id) => {
    return process(`SELECT type_attribute.attribute_name FROM asset, type_attribute WHERE asset.type_id=type_attribute.type_id AND asset.asset_id="${(id)}"`);
  },

  
  /**
   * Fetches all data fromasset, asset_data, type, type_attribute tables based on the id of the asset, tpye, attribute
   * @param  {} id - id of the asset
   * @return {}    [description]
   */
  assetAttributeValues: (id) => {
    return process(`
      SELECT * FROM asset, asset_data, type, type_attribute 
      WHERE asset.asset_id=asset_data.asset_id
      AND asset_archived="0" 
      AND type.id=type_attribute.type_id 
      AND asset.type_id=type.id 
      AND asset.type_id=type_attribute.type_id
      AND asset_data.attribute_id=type_attribute.attribute_id
      AND type.id=type_attribute.type_id 
      AND asset.asset_id="${id}"`);
  },

  /**
   * Fetches all data from asset and type tables based on the id of the type and asset
   * @param  {} id  - id of the asset
   * @return {}    [description]
   */
  assetJoinType: (id) => {
    return process(`SELECT * FROM asset, type WHERE asset.type_id=type.id AND asset.id="${(id)}"`);
  },

  // used for index page, . If it works call this assetType and return assetType above to asset.
  assetJoinTypeAll: () => {
    return process(`SELECT * FROM asset, type WHERE asset_archived="0" AND asset.type_id=type.id`);
  },

  /**
   * Fetches data from systemLogs and logtypes tables
   * @id - id of the log
   * @assetID - id of the asset
   * @assetName - name of the asset
   * @code - type of action applied to the asset (edited, added,deleted)
   * @return {} [description]
   */
  getLogs: () => {
    return process(`SELECT systemLogs.id, systemLogs.assetID, systemLogs.assetName,  logTypes.code, systemLogs.userID, systemLogs.object, systemLogs.created from systemLogs ,  logTypes where systemLogs.logTypeID=logTypes.id ORDER BY systemLogs.id DESC` );
  },

  /**
   * Fetches data from loginLogs and user tables
   * @id - id of the log
   * @userID - id of the user
   * @loginTime - time when user logged in
   * @logoutTime -  time when user logged out
   * @return {} [description]
   */
  getLoginLogs: () => {
    return process(`SELECT loginLogs.id, loginLogs.userID, user.username, loginLogs.loginTime, loginLogs.logoutTime from loginLogs, user where loginLogs.userID = user.user_id ORDER BY id DESC`);
  },
  
  /**
   * Insert passed parameters to the asset table
   * @param  id -   id of the asset
   * @param  asset_name - name of the asset
   * @param  type_id - id of the type
   * @return {}            [description]
   */
  insertAsset: (id, asset_name, type_id) => {
    return process(`INSERT INTO asset 
      VALUES ("${(id)}",
      "${(asset_name)}",
      "${(type_id)}",
      "0")`);
  },

  /**
   * Insert passed parameters to the asset_data table
   * @param  {} asset_id     id of the asset
   * @param  {} attribute_id id of the attribute
   * @param  {} value        user-typed data
   * @return {}              [description]
   */
  insertAssetData: (asset_id, attribute_id, value) => {
    return process(`INSERT INTO asset_data 
      VALUES ("${(asset_id)}",
      "${(attribute_id)}",
      "${(value)}")`);
  },

  /**
   * Fetches data from type table by name passed to the function
   * @param  typeName - name of the type
   * @return {}          [description]
   */
  selectType: (typeName) => {
    return process(`SELECT * FROM type WHERE name="${(typeName)}"`);
  },

  /**
   * Inserts  Insert passed parameters to the type table
   * @param  {} id       -  id of the type
   * @param  {} type_name - name of the type
   * @return {}           [description]
   */
  insertType: (id, type_name) => {
    return process(`INSERT INTO type 
      VALUES ("${(id)}",
      "${(type_name)}")`);
  },

  /**
   * [description]
   * @param  {} type_id        -  id of the type
   * @param  {} attribute_id   id of the attribute
   * @param  {} variable_type  type of the variable
   * @param  {} description    user-typed text
   * @param  {} attribute_name name of the attribute
   * @return {}                [description]
   */
  insertAttribute: (type_id, attribute_id, variable_type, description, attribute_name) => {
    return process(`INSERT INTO type_attribute 
      VALUES ("${(type_id)}",
      "${(attribute_id)}",
      "${(variable_type)}",
      "${(description) }",
      "${(attribute_name)}")`);
  },

/**
 *The table function holds the create queries for every table incase they are deleted
 */
  table: {
    /**
     * Creates asset table
     */
    asset: () => {
      return process(
        `CREATE TABLE asset (
        asset_id varchar(100) NOT NULL,
        asset_name varchar(45) NOT NULL,
        type_id varchar(100) NOT NULL,
        PRIMARY KEY (asset_id),
        KEY type_id_idx (type_id),
        CONSTRAINT type_id FOREIGN KEY (type_id) REFERENCES type (id) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
    },

    /**
     * Creates asset_data table
     */
    asset_data: () => {
      return process(
        `CREATE TABLE asset_data (
        asset_id varchar(100) NOT NULL,
        attribute_id varchar(100) NOT NULL,
        value varchar(100) NOT NULL,
        PRIMARY KEY (attribute_id,asset_id),
        KEY asset_id_idx (asset_id),
        KEY attribute_id_idx (attribute_id),
        CONSTRAINT asset_id FOREIGN KEY (asset_id) REFERENCES asset (asset_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_att_id FOREIGN KEY (attribute_id) REFERENCES type_attribute (attribute_id) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
    },

  /**
   * Creates comment table
   */
	comment: () => {
	  return process(
	    `CREATE TABLE comment (
	    userID varchar(45) DEFAULT '.',
	    assetID varchar(100) NOT NULL DEFAULT '.',
	    commentID varchar(45) NOT NULL DEFAULT '.',
	    comment varchar(250) DEFAULT '.',
	    date int(11) DEFAULT '1',
	    deleteDate varchar(45) DEFAULT '.',
	    isDeleted int(11) DEFAULT '1',
	    PRIMARY KEY (commentID, assetID)
	    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  }
,
  /**
   * Creates dependency table
   */
  dependency: () => {
    return process(
    `CREATE TABLE dependency (
    asset_dependency_id varchar(60) NOT NULL,
    asset_dependant_id varchar(60) NOT NULL,
    association_id varchar(60) NOT NULL,
    PRIMARY KEY (association_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  },
  
  /**
   * Creates group table
   */  
  group: () => {
    return process(
    `CREATE TABLE group (
    asset_id varchar(60) NOT NULL,
    group_id varchar(45) DEFAULT NULL,
    PRIMARY KEY (asset_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  },
   
  /**
   * Creates group_meta table
   */  
  group_meta: () => {
    return process(
    `CREATE TABLE group_meta (
    group_name varchar(60) NOT NULL,
    group_id varchar(45) NOT NULL,
    about varchar(45) DEFAULT NULL,
    PRIMARY KEY (group_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  },
   
  /**
   * Creates loginLogs table
   */  
  loginLogs: () => {
      return process(
    `CREATE TABLE loginLogs (
    id int(11) NOT NULL AUTO_INCREMENT,
    userID varchar(50) NOT NULL,
    loginTime datetime DEFAULT NULL,
    logoutTime datetime DEFAULT NULL,
    PRIMARY KEY (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=latin1;`);
  },
  
  /**
   * Creates logTypes table
   */  
  logTypes: () => {
    return process(
    `CREATE TABLE logTypes (
    id int(11) NOT NULL AUTO_INCREMENT,
    code varchar(50) CHARACTER SET utf8 DEFAULT NULL,
    PRIMARY KEY (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;`);
  }, 
    
  /**
   * Creates parent_child table
   */  
  parent_child: () => {
    return process(
    `CREATE TABLE parent_child (
    asset_parent_id varchar(60) NOT NULL,
    asset_child_id varchar(45) DEFAULT NULL,
    association_id varchar(45) DEFAULT NULL,
    PRIMARY KEY (asset_parent_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  },
  
  /**
   * Creates relation table
   */  
  relation: () => {
    return process(
    `CREATE TABLE relation (
    relation_id varchar(50) NOT NULL,
    assetA_id varchar(50) NOT NULL,
    assetB_id varchar(50) NOT NULL,
    PRIMARY KEY (relation_id, assetA_id, assetB_id),
    KEY assetA_id (assetA_id),
    KEY assetB_id (assetB_id),
    CONSTRAINT relation_ibfk_1 FOREIGN KEY (assetA_id) REFERENCES asset (asset_id),
    CONSTRAINT relation_ibfk_2 FOREIGN KEY (assetB_id) REFERENCES asset (asset_id),
    CONSTRAINT relation_ibfk_3 FOREIGN KEY (relation_id) REFERENCES relation_meta (relation_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  },
    
  /**
   * Creates relation_meta table
   */  
  relation_meta: () => {
    return process(
    `CREATE TABLE relation_meta (
    relation_id varchar(50) NOT NULL,
    relation_name varchar(50) NOT NULL,
    relation_description varchar(200) NOT NULL,
    relation_type_id varchar(50) NOT NULL,
    PRIMARY KEY (relation_id),
    KEY relation_type_id (relation_type_id),
    CONSTRAINT relation_meta_ibfk_1 FOREIGN KEY (relation_type_id) REFERENCES relation_type_meta (relation_type_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  },
    
  /**
   * Creates relation_type table
   */
  relation_type: () => {
    return process(
    `CREATE TABLE relation_type (
    relation_type_id varchar(50) NOT NULL,
    relation_id varchar(50) NOT NULL,
    PRIMARY KEY (relation_type_id, relation_id),
    KEY relation_id (relation_id),
    CONSTRAINT relation_type_ibfk_1 FOREIGN KEY (relation_type_id) REFERENCES relation_type_meta (relation_type_id),
    CONSTRAINT relation_type_ibfk_2 FOREIGN KEY (relation_id) REFERENCES relation_meta (relation_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  },
    
  /**
   * Creates relation_type_meta table
   */  
  relation_type_meta: () => {
    return process(
    `CREATE TABLE relation_type_meta (
    relation_type_id varchar(50) NOT NULL,
    relation_type_name varchar(50) NOT NULL,
    relation_type_description varchar(200) NOT NULL,
    PRIMARY KEY (relation_type_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  }, 

  /**
   * Creates sessions table
   */  
  sessions: () => {
    return process(
    `CREATE TABLE sessions (
    session_id varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
    expires int(11) unsigned NOT NULL,
    data text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
    PRIMARY KEY (session_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  },

  /**
   * Creates systemLogs table
   */  
  systemLogs: () => {
    return process(
    `CREATE TABLE systemLogs (
    id int(11) NOT NULL AUTO_INCREMENT,
    assetID varchar(50) DEFAULT NULL,
    assetName varchar(45) DEFAULT NULL,
    logTypeID int(11) DEFAULT NULL,
    userID varchar(50) NOT NULL,
    object varchar(45) DEFAULT NULL,
    created datetime DEFAULT NULL,
    PRIMARY KEY (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=latin1;`);
  },

  /**
   * Creates type table
   */  
  type: () => {
    return process(
    `CREATE TABLE type (
    id varchar(100) NOT NULL,
    name varchar(45) NOT NULL,
    PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  },
    
  /**
   * Creates type_attribute table
   */
  type_attribute: () => {
    return process(
    `CREATE TABLE type_attribute (
    type_id varchar(100) NOT NULL,
    attribute_id varchar(100) NOT NULL,
    variable_type varchar(45) NOT NULL,
    description varchar(45) NOT NULL,
    attribute_name varchar(45) NOT NULL,
    PRIMARY KEY (attribute_id, type_id),
    KEY type_id_idx (type_id),
    CONSTRAINT fk_type_id FOREIGN KEY (type_id) REFERENCES type (id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  },

  /**
   * Creates user table
   */  
  user: () => {
    return process(
    `CREATE TABLE user (
    user_id varchar(100) NOT NULL,
    email varchar(100) DEFAULT NULL,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    access varchar(255) NOT NULL,
    PRIMARY KEY (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  },
  
  /**
   * Creates userRoles table
   */  
  userRoles: () => {
   return process(
      `CREATE TABLE userRoles (
    role int(11) NOT NULL,
    privilege varchar(45) NOT NULL,
    PRIMARY KEY (role, privilege)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`);
  },
    
  },

}