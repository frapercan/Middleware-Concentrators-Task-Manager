const pool = require("_helpers/mysql");
const Study = require("./study.model");
let {groupCommunicationResultByLoop} = require("_helpers/grouping")

async function get(id) {

  const [result, metadata] = await pool.query(
    "SELECT a.nombre,count(b.id_paquete_concentrador) as 'total' from  estudio a RIGHT JOIN  paquete_concentrador b ON a.id_paquete = b.id_paquete where a.id_estudio = ?",
    [id]
  );

  return result[0];
}

async function create({
  studyName,
  studyDescription,
  targetsMode,
  packageId,
  targets,
  packageName,
  packageDescription,
  settingsMode,
  loopLength,
  executionNumber,
  attempts,
  priority,
  detect,
  fix,
  performances,
  reading }) {


  const LVCIDs = targets.map(cerco => cerco.lvcid);


  // Comprobaciones
  if ((detect.length == 0 && fix.length) && performances.length == 0) {

    throw new Error('No tasks to perform');
  }

  if (LVCIDs.length == 0) {
    throw new Error('No Cerco found');
  }



  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {



    const [targetsID, metadata] = await connection.query(
      "select id_concentrador from concentrador where lvcid in (?)",
      [LVCIDs]
    );

    /* Package insertion */
    let newPackage = packageId;
    if (targetsMode == 2) {
      const [paquete] = await connection.query(
        "insert into paquete (nombre,descripcion) VALUES (?,?)", [packageName, packageDescription]
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
    if (settingsMode == "1") {
      [configuracion_ejecucion] = await connection.query(
        "insert into configuracion_ejecucion(n_ciclos,id_prioridad,n_intentos_comunicacion) values (1,?,?)",
        [priority, attempts]
      );
    } else {
      [configuracion_ejecucion] = await connection.query(
        "insert into configuracion_ejecucion(num_horas_periodicidad,n_ciclos,id_prioridad,n_intentos_comunicacion) values (?,?,?,?)",
        [
          loopLength,
          executionNumber,
          priority,
          attempts
        ]
      );
    }

    /* Issues Settings insertion */
    let estudio_configuracion_incidencia = null;
    if (fix.length > 0 || detect.length > 0) {
      [estudio_configuracion_incidencia] = await connection.query(
        "insert into estudio_configuracion_incidencia (nombre) values ('')"
      );
      configuracion_incidencia_values = issues.fix.map(item => [
        estudio_configuracion_incidencia.insertId,
        item.id_incidencia,
        1, //Detectar (Requisito core, no me gusta)
        1, //Modo arreglar
        1 // Ciclo inicial
      ]);

      for (det of detect) {
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
      console.log(configuracion_incidencia_values)
      const [configuracion_incidencia] = await connection.query(
        "insert into configuracion_incidencia (id_estudio_configuracion_incidencia,id_incidencia,deteccion,correcion,ciclo_insercion) values ?",
        [configuracion_incidencia_values]
      );
    }

    /* Performances Settings insertion */
    let estudio_configuracion_actuacion = null;
    if (performances.length > 0) {
      estudio_configuracion_actuacion = await connection.query(
        "insert into estudio_configuracion_actuacion (nombre) values ('')"
      );
      const configuracion_actuacion_values = performances.performances.map(perf => [estudio_configuracion_actuacion.insertId, perf.id_actuacion, 1])

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
        estudio_configuracion_incidencia ? estudio_configuracion_incidencia.insertId : estudio_configuracion_incidencia,
        estudio_configuracion_actuacion ? estudio_configuracion_actuacion.insertId : estudio_configuracion_actuacion,
        studyName,
        studyDescription
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
    ) as concentradores_cantidad, \
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
      study.concentradores_cantidad,
      study.finalizado_tarea,
      study.progreso_tarea,
      study.encolado_tarea,
      study.pendiente_tarea
    );
  });
}


async function getCommunicationResult(id) {
  const [result, metadata] = await pool.query(
    "SELECT * FROM 0_MASTER_GAP_Pruebas.view_analisis_de_comunicacion \
    where id_estudio = ? \
    order by ciclo asc, FIELD(name, 'total', 'Finalizado correctamente', 'pendiente', 'no accedido', \
    'Ping KO', 'Error apertura socket', 'CERCO ocupado', 'Error de autenticacion', \
    'Puerto Comandos Bloqueado', 'CERCO no encontrado en MongoDB', 'Claves CERCO no encontrada en BDE', 'GPRS Inestable');",
    [id]
  );
  return groupCommunicationResultByLoop(result)
}

async function getCommunicationResultOverview(id) {
  console.log(id)
  const [result, metadata] = await pool.query(
    "SELECT ciclo, \
    SUM(CASE \
        WHEN id_resultado = 7 OR id_resultado = 4 THEN amount \
    END) AS comunicacion, \
        SUM(CASE \
        WHEN id_resultado = 2 THEN amount \
    END) AS posible_incidencia, \
        SUM(CASE \
        WHEN id_resultado = 3 THEN amount \
    END) AS gestion_sistemas, \
            SUM(CASE \
        WHEN id_resultado = 7 or id_resultado = 4 or id_resultado = 2 or id_resultado = 3 THEN amount \
    END) AS total \
FROM \
    view_analisis_de_comunicacion \
WHERE \
    id_estudio = ? \
GROUP BY ciclo;",
    [id]
  );
  return result
}


async function getCiclosInfo(id) {
  const [result, metadata] = await pool.query(
    "SELECT ciclo, fecha_inicio as first, fecha_finalizacion as last FROM 0_MASTER_GAP_Pruebas.estado_estudio_ciclo \
    where id_estudio = ?;",
    [id]
  );
  let cycles = {}
  result.forEach(cycle => {
    cycles[cycle.ciclo] = { 'first': cycle.first, 'last': cycle.last }
  })
  return cycles
}

module.exports = {
  get,
  create,
  getAll,
  getCommunicationResult,
  getCommunicationResultOverview,
  getCiclosInfo
};



