﻿const pool = require("_helpers/mysql");
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
  lvcidS = concentrators.map(lvcid => lvcid.lvcid);
  const [
    result,
    metadata
  ] = await pool.query(
    "SELECT * FROM 0_MASTER_GAP_Pruebas.informacion_concentrador_front where lvcid in (?);",
    [lvcidS]
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

async function getConcentratorsByPackage(package) {
  const [result, metadata] = await pool.query(
    "SELECT c.lvcid as lvcid FROM paquete_concentrador pc \
     right join concentrador c on c.id_concentrador = pc.id_concentrador  \
     where pc.id_paquete = ?;",
    package.id_paquete
  );

  return result
}

module.exports = {
  getAll,
  getConcentrators,
  getConcentratorsByPackage
};
