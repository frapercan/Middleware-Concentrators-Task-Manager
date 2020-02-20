const pool = require("_helpers/mysql");
const Attribute = require("./attribute.model");

async function getAttributesList() {
  const [result, metadata] = await pool.query("SELECT * from atributo;");
  return result;
}
module.exports = {

  getAttributesList

};

