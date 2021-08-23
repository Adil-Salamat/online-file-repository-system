const intformat = require('biguint-format')
const FlakeId = require('flake-idgen');
const flakeIdGen1 = new FlakeId();

module.exports = {
  
  /**
   * Returns a newly generated snowflake id.
   */
  new: () => {
    return intformat(flakeIdGen1.next(), 'dec');
  }
}