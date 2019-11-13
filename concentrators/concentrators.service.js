const pool = require("_helpers/mysql");
const Concentrator = require("./concentrators.model");

async function getAll() {
  const [result, metadata] = await pool.query(
    "SELECT \
    v_inf.id_concentrador,\
    v_inf.lvcid,\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = 'CERCO-VER') as 'CERCO-VER',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = 'HW-VER') as 'HW-VER',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = 'ROM-VER') as 'ROM-VER',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = 'MODEM-VER') as 'MODEM-VER',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = '/var') as 'var',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = '/disk') as '/disk',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = '/tmpn2pload') as '/tmpn2pload',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = '/tmpdailyClosure') as '/tmpdailyClosure',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = 'MODEM-REBOOT-PERIODICITY') as 'MODEM-REBOOT-PERIODICITY',\
    (SELECT dato FROM view_informacion_concentrador where id_concentrador = v_inf.id_concentrador and nombre = 'CERCO-REBOOT-PERIODICITY') as 'CERCO-REBOOT-PERIODICITY'\
    FROM view_informacion_concentrador v_inf\
    group by v_inf.id_concentrador;"
  );

  return result.map(concentrator => {
    return new Concentrator(
      concentrator.id_concentrador,
      concentrator.lvcid,
      concentrator["CERCO-VER"],
      concentrator["HW-VER"],
      concentrator["ROM-VER"],
      concentrator["MODEM-VER"],
      concentrator["var"],
      concentrator["/disk"],
      concentrator["/tmpn2pload"],
      concentrator["/tmpdailyClosure"],
      concentrator["MODEM-REBOOT-PERIODICITY"],
      concentrator["CERCO-REBOOT-PERIODICITY"]






      
    );
  });
}

module.exports = {
  getAll
};
