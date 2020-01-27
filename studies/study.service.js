const pool = require("_helpers/mysql");
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
  const { study, targets, settings, issues, performances } = form;
  const LVCIDs = targets.targets.map(cerco => cerco.lvcid);
  


  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [targetsID, metadata] = await connection.query(
      "select id_concentrador from concentrador where lvcid in (?)",
      [LVCIDs]
    );

    /* Package insertion */
    let newPackage = targets.package;
    if (targets.selectionMode == 2) { //Creamos un paquete nuevo con sus correspondicentes concentradores y tabla relacional
      const [paquete] = await connection.query(
        "insert into paquete (nombre,descripcion) VALUES (?,?)", [targets.name, targets.description]
      );
      newPackage = paquete.insertId

      const paquete_concentrador_values = targetsID.map(item => [
        paquete.insertId,
        item.id_concentrador
      ]);
      const [paquete_concentrador] = await connection.query(
        "insert into paquete_concentrador(id_paquete,id_concentrador) VALUES ?",
        [paquete_concentrador_values]
      );
    }

    /* Execution Settings insertion */
    if (settings.settingsMode == "1") {
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

    /* Issues Settings insertion */

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
      for (task of configuracion_incidencia_values) {
        if (det.id_incidencia == task[1]) {
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
    if (configuracion_incidencia_values.length > 0) {
      const [configuracion_incidencia] = await connection.query(
        "insert into configuracion_incidencia (id_estudio_configuracion_incidencia,id_incidencia,deteccion,correcion,ciclo_insercion) values ?",
        [configuracion_incidencia_values]
      );
    }

    /* Performances Settings insertion */
    const [estudio_configuracion_actuacion] = await connection.query(
      "insert into estudio_configuracion_actuacion (nombre) values ('')"
    );
    const configuracion_actuacion_values = performances.performances.map(perf => [estudio_configuracion_actuacion.insertId, perf.id_actuacion, 1])
    if (configuracion_actuacion_values.length > 0) {
      const [configuracion_actuacion] = await connection.query(
        "insert into configuracion_actuacion (id_estudio_configuracion_actuacion,id_actuacion,ciclo_insercion) values ?",
        [configuracion_actuacion_values]
      );
    }

    /* Study insertion */
    const [estudio] = await connection.query(
      "insert into estudio (id_paquete,id_configuracion_ejecucion,id_configuracion_incidencia,id_configuracion_actuacion,nombre,descripcion) values (?,?,?,?,?,?)",
      [
        newPackage,
        configuracion_ejecucion.insertId,
        estudio_configuracion_incidencia.insertId,
        estudio_configuracion_actuacion.insertId,
        study.name,
        study.description
      ]

    );
    console.log(`estudio ${estudio.insertId} insertado correctamente`);

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
    cont.ciclo_actual,\
    min(cont.fecha_inicio) as fecha_inicio_ciclo, \
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
      study.ciclo_actual,
      study.fecha_inicio_ciclo,
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
    "SELECT * FROM 0_MASTER_GAP_Pruebas.view_analisis_de_comunicacion \
    where id_estudio = ? \
    order by ciclo asc, FIELD(name, 'total', 'Finalizado correctamente', 'pendiente', 'no accedido', \
    'Ping KO', 'Error apertura socket', 'CERCO ocupado', 'Error de autenticacion', \
    'Puerto Comandos Bloqueado', 'CERCO no encontrado en MongoDB', 'Claves CERCO no encontrada en BDE', 'GPRS Inestable');",
    [id]
  );

  return groupByCiclo(result);
}

async function getIssuesResult(id) {
  const [result, metadata] = await pool.query(
    "SELECT ciclo, nombre, detectado, corregido, fixflag, id_incidencia FROM 0_MASTER_GAP_Pruebas.view_analisis_de_problemas where id_estudio = ?;",
    [id]
  );
  return groupByCiclo(result);
}

async function getIssuesList() {
  const [result, metadata] = await pool.query("SELECT * from incidencia;");
  return result;
}

async function getIssuesGroupsList() {
  const [result, metadata] = await pool.query("SELECT * from grupo_incidencia where id_grupo_incidencia in (6,1,2,3) order by id_grupo_incidencia desc;");
  return result;
}

async function getPerformancesList() {
  const [result, metadata] = await pool.query("SELECT * from actuacion;");
  return result;
}

async function getAttributesList() {
  const [result, metadata] = await pool.query("SELECT * from atributo;");
  return result;
}

async function getCiclosInfo(id) {
  const [result, metadata] = await pool.query(
    "SELECT ciclo, fecha_inicio as first, fecha_finalizacion as last FROM 0_MASTER_GAP_Pruebas.estado_estudio_ciclo \
    where id_estudio = ?;",
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
  getIssuesGroupsList,
  getPerformancesList,
  getAttributesList,
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
