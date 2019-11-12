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

  return result; // Get rid of empty communication problems
}

async function getIssuesResult(id) {
  const [result, metadata] = await pool.query(
    "select nombre_incidencia,sum(case when id_resultado_incidencia in (3,4,5) then numero_equipos else 0 end) as detectados,sum(case when id_resultado_incidencia = 5 then numero_equipos else 0 end) as  arreglados,sum(case when id_resultado_incidencia in(5,6) then 1 else 0 end) as fixflag from  \
    ((SELECT  \
        b.nombre_incidencia, \
        b.id_incidencia, \
        a.id_resultado_incidencia, \
        COUNT(a.id_resultado_incidencia) as numero_equipos \
    FROM \
        0_MASTER_GAP_v2.3_3_resultado_incidencia_cerco a \
            LEFT JOIN \
        0_MASTER_GAP_v2.5_0_incidencia b ON a.id_incidencia = b.id_incidencia \
    WHERE \
        id_paquete = ? \
            AND id_resultado_incidencia IN (4 , 5, 6) \
    GROUP BY a.id_incidencia , a.id_resultado_incidencia)   \
    UNION SELECT  \
        b.nombre_incidencia, NULL, NULL,null \
    FROM \
        0_MASTER_GAP_v2.3_1_perfil_configuracion_incidencia perf \
            LEFT JOIN \
        0_MASTER_GAP_v2.5_0_incidencia b ON perf.id_incidencia = b.id_incidencia \
    WHERE \
        perf.id_paquete = ?) b group by b.nombre_incidencia ;",
    [id, id]
  );
  return result;
}

async function getIssuesList() {
  const [result, metadata] = await pool.query(
    "SELECT * FROM 0_MASTER_GAP_v2.5_0_incidencia;"
  );
  return result;
}

module.exports = {
  get,
  createStudy,
  getAll,
  getCommunicationResult,
  getIssuesResult,
  getIssuesList
};
