const pool = require("_helpers/mysql");
const Performance = require("./performance.model");
let { groupPerformancesResultByLoop } = require("_helpers/grouping")





async function getPerformancesList() {
  const [result, metadata] = await pool.query("SELECT * from actuacion;");
  return result;
}

async function getPerformancesResult(id){
  const[result, metadata] = await  pool.query(" \
  SELECT act.nombre, ciclo,est_ciclo.nombre as nombre_resultado, res_act.id_resultado_actuacion, count(*) as cantidad\
  FROM `0_MASTER_GAP_Pruebas`.`resultado_actuacion_cerco` res_act \
  INNER JOIN `0_MASTER_GAP_Pruebas`.`resultado_actuacion` est_ciclo \
  ON id_estudio = ?  and res_act.id_resultado_actuacion = est_ciclo.id_resultado_actuacion \
  INNER JOIN actuacion act on act.id_actuacion = res_act.id_actuacion \
  group by ciclo, id_resultado_actuacion",[id])
  return groupPerformancesResultByLoop(result)
}



module.exports = {
  getPerformancesList,
  getPerformancesResult
};

