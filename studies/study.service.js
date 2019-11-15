﻿const pool = require("_helpers/mysql");
const poolTransaction = require("_helpers/mysql");
const Study = require("./studies.model");

async function get(id) {
  const [result, metadata] = await pool.query(
    "SELECT a.nombre,count(b.id_paquete_concentrador) as 'total' from  estudio a RIGHT JOIN  paquete_concentrador b ON a.id_paquete = b.id_paquete where a.id_estudio = ?",
    [id]
  );
  return result[0];
}

async function create(form) {
  const targets = form["targets"].map(cerco => cerco.LVCID);
  const { name, description, settings, issues } = form;

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [targetsID, metadata] = await connection.query(
      "select id_concentrador from concentrador where lvcid in (?)",
      [targets]
    );

    const [paquete] = await connection.query(
      "insert into paquete (id_paquete) VALUES ('')  "
    );
    const id_paquete = paquete.insertId;
    const paquete_concentrador_values = targetsID.map(item => [
      id_paquete,
      item.id_concentrador
    ]);
    const [paquete_concentrador] = await connection.query(
      "insert into paquete_concentrador(id_paquete,id_concentrador) VALUES ?",
      [paquete_concentrador_values]
    );
    if (settings.mode == "1") {
      [configuracion_ejecucion] = await connection.query(
        "insert into configuracion_ejecucion(n_ciclos,id_prioridad,n_intentos_comunicacion) values (1,?,?)",
        [settings.priority, settings.attempts]
      );
    } else {
      [configuracion_ejecucion] = await connection.query(
        "insert into configuracion_ejecucion(num_horas_periodicidad,n_ciclos,id_prioridad,n_intentos_comunicacion) values (?,?,?,?)",
        [
          settings.loopLength,
          settings.executionNumber,
          settings.priority,
          settings.attempts
        ]
      );
    }

    const [estudio_configuracion_incidencia] = await connection.query(
      "insert into estudio_configuracion_incidencia (nombre) values ('')"
    );
    configuracion_incidencia_values = issues.fix.map(item => [
      estudio_configuracion_incidencia.insertId,
      item.id_incidencia,
      1,
      1,
      1
    ]);
    for (det of issues.detect) {
      let marked_as_fix = 0;
      for (iss of configuracion_incidencia_values) {
        if (det.id_incidencia == iss[1]) {
          marked_as_fix = 1;
        }
      }
      if (!marked_as_fix) {
        configuracion_incidencia_values.push([
          estudio_configuracion_incidencia.insertId,
          det.id_incidencia,
          1,
          0,
          1
        ]);
      }
    }
    const [configuracion_incidencia] = await connection.query(
      "insert into configuracion_incidencia (id_estudio_configuracion_incidencia,id_incidencia,deteccion,correcion,ciclo_insercion) values ?",
      [configuracion_incidencia_values]
    );
    console.log(paquete.insertId,configuracion_ejecucion.insertId,estudio_configuracion_incidencia.insertId,name.name,description.description)
    const [estudio] = await connection.query(
      "insert into estudio (id_paquete,id_configuracion_ejecucion,id_configuracion_incidencia,nombre,descripcion) values (?,?,?,?,?)",
      [
        paquete.insertId,
        configuracion_ejecucion.insertId,
        estudio_configuracion_incidencia.insertId,
        name.name,
        description.description
      ]
    );
    console.log(estudio)

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    // Throw the error again so others can catch it.
    throw err;
  } finally {
    connection.release();
  }
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
      view_resultado_comunicacion_cerco WHERE\
          id_estudio = ?\
          group by ciclo\
    UNION\
    SELECT \
      COM.nombre,\
      RESCOM.ciclo,\
      COUNT(RESCOM.id_resultado_comunicacion) AS 'amount'\
    FROM\
    view_resultado_comunicacion_cerco RESCOM\
          LEFT JOIN\
      resultado_comunicacion COM ON COM.id_resultado_comunicacion = RESCOM.id_resultado_comunicacion\
    WHERE\
      RESCOM.id_estudio = ?\
    GROUP BY RESCOM.ciclo , RESCOM.id_resultado_comunicacion \
    UNION SELECT \
      'Inaccesibles', ciclo, COUNT(*) AS amount\
    FROM\
    view_resultado_comunicacion_cerco\
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
    "SELECT       \
    RESINC.ciclo,      \
    D.nombre,      \
    COUNT(DISTINCT (CASE WHEN RESINC.id_resultado_incidencia IN (4, 5, 6) \
    AND C.id_incidencia = RESINC.id_incidencia THEN 1 END)) AS detectado,      \
    COUNT(DISTINCT (CASE WHEN RESINC.id_resultado_incidencia IN (6) \
    AND C.id_incidencia = RESINC.id_incidencia THEN 1 END)) AS corregido,          \
    C.correcion as fixflag     \
    FROM estudio A \
    INNER JOIN estudio_configuracion_incidencia B \
    ON A.id_configuracion_incidencia = B.id_estudio_configuracion_incidencia          \
    INNER JOIN configuracion_incidencia C \
    ON C.id_estudio_configuracion_incidencia = B.id_estudio_configuracion_incidencia        \
    INNER JOIN incidencia D \
    ON D.id_incidencia = C.id_incidencia         \
    INNER JOIN resultado_incidencia_cerco RESINC \
    ON A.id_estudio = RESINC.id_estudio \
    WHERE A.id_estudio = ?  \
    GROUP BY RESINC.ciclo , D.nombre",
    [id]
  );
  return groupByCiclo(result);
}

async function getIssuesList() {
  const [result, metadata] = await pool.query(
    "SELECT * from incidencia;"
  );
  return result;
}

async function getCiclosInfo(id) {
  const [result, metadata] = await pool.query(
    "SELECT ciclo,min(fecha_comunicacion) as first ,max(fecha_comunicacion) as last  FROM 0_MASTER_GAP_Pruebas.resultado_comunicacion_cerco where id_estudio = ? group by ciclo;",
    [id]
  );
  return result;
}

module.exports = {
  get,
  create,
  getAll,
  getCommunicationResult,
  getIssuesResult,
  getIssuesList,
  getCiclosInfo
};

function groupByCiclo(obj) {
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
