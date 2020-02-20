const pool = require("_helpers/mysql");

const Issue = require("./issue.model");

let { groupIssuesResultByLoop,groupIssuesResultOverviewByLoop } = require("_helpers/grouping")




async function getIssuesList() {
  const [result, metadata] = await pool.query("SELECT * from incidencia;");
  return result;
}

async function getIssuesGroupsList() {
  const [result, metadata] = await pool.query("SELECT * from grupo_incidencia where id_grupo_incidencia in (6,1,2,3) order by id_grupo_incidencia desc;");
  return result;
}

async function getIssuesResult(id) {
  const [result, metadata] = await pool.query(
    "SELECT ciclo, nombre, detectado, corregido, fixflag, id_incidencia FROM 0_MASTER_GAP_Pruebas.view_analisis_de_problemas where id_estudio = ?;",
    [id]
  );
  return groupIssuesResultByLoop(result)
}


async function getIssuesResultOverview(id) {
  const [result, metadata] = await pool.query(
    "SELECT ciclo, sum(detectado) as detectado, sum(corregido) as corregido FROM 0_MASTER_GAP_Pruebas.view_analisis_de_problemas where id_estudio = ? \
    group by ciclo;",
    [id]
  );
  return groupIssuesResultOverviewByLoop(result);
}

module.exports = {
  getIssuesResult,
  getIssuesList,
  getIssuesGroupsList,
  getIssuesResultOverview
};


