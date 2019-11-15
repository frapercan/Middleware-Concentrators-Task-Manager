const pool = require("_helpers/mysql");
const Concentrator = require("./concentrators.model");

async function getAll() {
  const [result, metadata] = await pool.query(
    "SELECT \
    v_inf.id_concentrador,\
    v_inf.lvcid,\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = 'CERCO-VER') as 'cercoVersion',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = 'HW-VER') as 'hwVersion',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = 'ROM-VER') as 'romVersion',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = 'MODEM-VER') as 'modemVersion',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = '/var') as 'varMem',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = '/disk') as 'diskMem',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = '/tmpn2pload') as 'tmpn2ploadMem',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = '/tmpdailyClosure') as 'tmpDailyClousureMem',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = 'MODEM-REBOOT-PERIODICITY') as 'modemRebootPeriodicity',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = 'CERCO-REBOOT-PERIODICITY') as 'cercoRebootPeriodicity'\
    FROM view_informacion_concentrador v_inf\
    group by v_inf.id_concentrador;"
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
  getAll
};
