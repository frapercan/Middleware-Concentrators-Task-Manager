const pool = require("_helpers/mysql");
const Package = require("./package.model");



async function getAll() {
    const [result, metadata] = await pool.query(
      "SELECT * FROM paquete;"
    );
  
    return result.map(package => {
      return new Package(
        package.id_paquete,
        package.nombre,
        package.descripcion,
        package.fecha_insercion
      );
    });
  }


module.exports = {
    getAll
};

