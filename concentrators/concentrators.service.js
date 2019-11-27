const pool = require("_helpers/mysql");
const Concentrator = require("./concentrators.model");

async function getAll() {
  const [result, metadata] = await pool.query(
    "SELECT * FROM 0_MASTER_GAP_Pruebas.informacion_concentrador_front;"
  );

  return result.map(concentrator => {
    return new Concentrator(
      concentrator.id_concentrador,
      concentrator.lvcid,
      concentrator.cercoVersion,
      concentrator.hwVersion,
      concentrator.romVersion,
      concentrator.modemVersion,
      concentrator.varMem,
      concentrator.diskMem,
      concentrator.tmpn2ploadMem,
      concentrator.tmpDailyClousureMem,
      concentrator.modemRebootPeriodicity,
      concentrator.cercoRebootPeriodicity
    );
  });
}


async function getConcentrators(concentrators) {
  console.log(concentrators)
  LVCIDS = concentrators.map(lvcid => lvcid.LVCID)
  console.log(LVCIDS)
  const [result, metadata] = await pool.query(
    "SELECT * FROM 0_MASTER_GAP_Pruebas.informacion_concentrador_front where lvcid in (?);",[LVCIDS]
  );

  return result.map(concentrator => {
    return new Concentrator(
      concentrator.id_concentrador,
      concentrator.lvcid,
      concentrator.cercoVersion,
      concentrator.hwVersion,
      concentrator.romVersion,
      concentrator.modemVersion,
      concentrator.varMem,
      concentrator.diskMem,
      concentrator.tmpn2ploadMem,
      concentrator.tmpDailyClousureMem,
      concentrator.modemRebootPeriodicity,
      concentrator.cercoRebootPeriodicity
    );
  });
}

module.exports = {
  getAll,
  getConcentrators
};
