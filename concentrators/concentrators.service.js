const pool = require("_helpers/mysql");
const Concentrator = require("./concentrators.model");



async function getAll() {
  const [result, metadata] = await pool.query(
    "select distinct(lvcid) FROM 0_MASTER_GAP_v2.1_0_concentradores_paquete"
  );

  return result.map(concentrator => {
    return new Concentrator(
   //   concentrator.id_concentrador,
      concentrator.lvcid
    );
  });
}




module.exports = {

  getAll

};
