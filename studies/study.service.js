const pool = require("_helpers/mysql");
const Study = require("./studies.model");

async function get(id) {
  const [result, metadata] = await pool.query(
    "SELECT a.nombre,count(b.id_paquete_concentrador) as 'total' from  estudio a RIGHT JOIN  paquete_concentrador b ON a.id_paquete = b.id_paquete where a.id_estudio = ?",
    [id]
  );
  return result[0];
}

async function createExecutionSettings(form) {
  pool.query();

  return 200;
}

async function createIssueSettings(form) {
  pool.query();

  return 200;
}

async function createStudy(form) {
  pool.query();
  return 200;
}

async function createCERCOPackage(form) {
  pool.query();
  return 200;
}

async function createStudy(form) {
  pool.query();
  return 200;
}
async function getAll() {
  const [result, metadata] = await pool.query(
    "select \
    a.id_estudio, \
    a.nombre, \
    a.fecha_insercion, \
    conf.n_ciclos, \
    COUNT( \
      distinct(cont.id_concentrador)\
    ) as total, \
    COUNT( \
      cont.id_concentrador \
    ) as total_tareas, \
    COUNT( \
      CASE WHEN cont.id_estado_ejecucion = 3 THEN 1 END \
    ) AS finalizado_tarea, \
    COUNT( \
      CASE WHEN cont.id_estado_ejecucion = 2 THEN 1 END \
    ) AS progreso_tarea,  \
    COUNT( \
      CASE WHEN cont.id_estado_ejecucion = 1 THEN 1 END \
    ) AS encolado_tarea, \
    COUNT( \
      CASE WHEN cont.id_estado_ejecucion = 0 THEN 1 END \
    ) AS pendiente_tarea \
  FROM \
    estudio a \
    inner JOIN controlador cont ON a.id_estudio = cont.id_estudio \
    inner JOIN configuracion_ejecucion conf ON conf.id_configuracion_ejecucion = a.id_configuracion_ejecucion \
  group by \
    a.id_estudio;"
  );

  return result.map(study => {
    return new Study(
      study.id_estudio,
      study.nombre,
      study.fecha_insercion,
      study.n_ciclos,
      study.total,
      study.total_tareas,
      study.finalizado_tarea,
      study.progreso_tarea,
      study.encolado_tarea,
      study.pendiente_tarea
    );
  });
}

// posible refactorizacion.
async function getCommunicationResult(id) {
  const [result, metadata] = await pool.query(
    "SELECT \
    'total' as 'name',ciclo, COUNT(*) AS 'amount'\
      FROM\
          resultado_comunicacion_cerco WHERE\
          id_estudio = ?\
          group by ciclo\
    UNION\
    SELECT \
      COM.nombre,\
      RESCOM.ciclo,\
      COUNT(RESCOM.id_resultado_comunicacion) AS 'amount'\
    FROM\
      resultado_comunicacion_cerco RESCOM\
          LEFT JOIN\
      resultado_comunicacion COM ON COM.id_resultado_comunicacion = RESCOM.id_resultado_comunicacion\
    WHERE\
      RESCOM.id_estudio = ?\
    GROUP BY RESCOM.ciclo , RESCOM.id_resultado_comunicacion \
    UNION SELECT \
      'Inaccesibles', ciclo, COUNT(*) AS amount\
    FROM\
      resultado_comunicacion_cerco\
    WHERE\
      id_estudio = ?\
          AND id_resultado_comunicacion != 1\
    GROUP BY ciclo;",
    [id, id, id]
  );

  return groupByCiclo(result);
}

async function getIssuesResult(id) {
  const [result, metadata] = await pool.query(
    "SELECT \
      E.ciclo,\
      D.nombre,\
      COUNT(DISTINCT (CASE\
              WHEN\
                  RESINC.id_resultado_incidencia IN (4, 5, 6)\
                      AND C.id_incidencia = RESINC.id_incidencia\
                      AND E.ciclo = RESINC.ciclo\
              THEN\
                  1\
          END)) AS detectado,\
      COUNT(DISTINCT (CASE\
              WHEN\
                  RESINC.id_resultado_incidencia IN (6)\
                      AND C.id_incidencia = RESINC.id_incidencia\
                      AND E.ciclo = RESINC.ciclo\
              THEN\
                  1\
          END)) AS corregido,\
          0 as fixflag \
    FROM\
      estudio A\
          INNER JOIN\
      estudio_configuracion_incidencia B ON A.id_configuracion_incidencia = B.id_estudio_configuracion_incidencia\
          INNER JOIN\
      configuracion_incidencia C ON C.id_estudio_configuracion_incidencia = B.id_estudio_configuracion_incidencia\
          INNER JOIN\
      incidencia D ON D.id_incidencia = C.id_incidencia\
          INNER JOIN\
      resultado_comunicacion_cerco E ON E.id_estudio = A.id_estudio\
          INNER JOIN\
      resultado_incidencia_cerco RESINC ON A.id_estudio = RESINC.id_estudio\
  WHERE\
      A.id_estudio = ?\
  GROUP BY E.ciclo , D.nombre;",
    [id]
  );
  return groupByCiclo(result);
}

async function getIssuesList() {
  const [result, metadata] = await pool.query(
    "SELECT * FROM 0_MASTER_GAP_v2.5_0_incidencia;"
  );
  return result;
}

async function getCiclosInfo(id) {
  const [result, metadata] = await pool.query(
    "SELECT ciclo,max(fecha_comunicacion) as first ,min(fecha_comunicacion) as last  FROM 0_MASTER_GAP_Pruebas.resultado_comunicacion_cerco where id_estudio = ? group by ciclo;",[id]
  )
  return result;
}

module.exports = {
  get,
  createStudy,
  getAll,
  getCommunicationResult,
  getIssuesResult,
  getIssuesList,
  getCiclosInfo
};

function groupByCiclo(obj){
  //uff,
  groupedByCiclo = {};
  obj.map(item => (groupedByCiclo[Number(item.ciclo)] = []));
  for (let i of Object.keys(groupedByCiclo)) {
    for (var j = 0; j < obj.length; j++) {
      if (obj[j].ciclo == i) {
        groupedByCiclo[i].push(obj[j]);
      }
    }
  }
  return Object.keys(groupedByCiclo).map(loop => groupedByCiclo[loop]);
}