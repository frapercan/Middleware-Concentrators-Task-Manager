const pool = require("_helpers/mysql");
const Study = require("./studies.model");

async function get(id) {
  const [result, metadata] = await pool.query(
    "SELECT nombre_estudio,count(b.lvcid) as 'total_cerco' from 0_MASTER_GAP_v2.0_0_paquete a RIGHT JOIN 0_MASTER_GAP_v2.1_0_concentradores_paquete b ON a.id_paquete = b.id_paquete where a.id_paquete = ?",
    [id]
  );
  return result[0];
}

async function getAll() {
  const [result, metadata] = await pool.query(
    "SELECT  \
    paq.id_paquete, \
    nombre_estudio, \
    fecha_insercion, \
    id_tipo_periodicidad, \
    COUNT(con.lvcid) AS total_cerco, \
    COUNT(CASE \
        WHEN con.id_estado_tareas_paquete_cerco = 3 THEN 1 \
    END) AS finalizado_cerco, \
    COUNT(CASE \
        WHEN con.id_estado_tareas_paquete_cerco = 2 THEN 1 \
    END) AS progreso_cerco, \
    COUNT(CASE \
        WHEN con.id_estado_tareas_paquete_cerco = 1 THEN 1 \
    END) AS pendiente_cerco \
FROM \
    0_MASTER_GAP_v2.0_0_paquete paq \
        RIGHT JOIN \
    0_MASTER_GAP_v2.1_0_concentradores_paquete con ON con.id_paquete = paq.id_paquete \
where paq.id_paquete IS NOT NULL \
group by \
    con.id_paquete;"
  );

  return result.map(study => {
    return new Study(
      study.id_paquete,
      study.nombre_estudio,
      study.fecha_insercion,
      study.id_tipo_periodicidad,
      study.total_cerco,
      study.finalizado_cerco,
      study.progreso_cerco,
      study.pendiente_cerco,
      study.finalizado_cerco / study.total_cerco
    );
  });
}

// posible refactorizacion.
async function getCommunicationResult(id) {
  const [result, metadata] = await pool.query(
    "SELECT  \
'Total' as 'nombre', COUNT(*) as cantidad \
FROM \
0_MASTER_GAP_v2.1_0_concentradores_paquete \
WHERE \
id_paquete = ?  \
UNION SELECT  \
a.nombre_estado_tarea_paquete_cerco_finalizado, b.count \
FROM \
0_MASTER_GAP_v2.1_1_0_estado_tareas_paquete_cerco_finalizado a \
    LEFT JOIN \
(SELECT  \
    id_estado_tareas_paquete_cerco_finalizado, \
        COUNT(id_estado_tareas_paquete_cerco) AS count \
FROM \
    0_MASTER_GAP_v2.1_0_concentradores_paquete \
WHERE \
    id_paquete = ? \
        AND id_estado_tareas_paquete_cerco = 3 \
GROUP BY id_estado_tareas_paquete_cerco_finalizado) b ON a.id_estado_tarea_paquete_cerco_finalizado = b.id_estado_tareas_paquete_cerco_finalizado  \
UNION (SELECT  \
'Pendientes' AS Pending, SUM(a.count) \
FROM \
(SELECT  \
    id_estado_tareas_paquete_cerco, \
        COUNT(id_estado_tareas_paquete_cerco) AS count \
FROM \
    0_MASTER_GAP_v2.1_0_concentradores_paquete \
WHERE \
    id_paquete = ? \
        AND id_estado_tareas_paquete_cerco != 3 \
GROUP BY id_estado_tareas_paquete_cerco) a) UNION (SELECT  \
'Inaccesibles', COUNT(*) \
FROM \
0_MASTER_GAP_v2.1_0_concentradores_paquete \
WHERE \
id_paquete = ? \
    AND id_estado_tareas_paquete_cerco = 3 \
    AND id_estado_tareas_paquete_cerco_finalizado != 1);",
    [id, id, id, id]
  );
  return result.filter(result => result.cantidad); // Get rid of empty communication problems
}


async function getIncidentResult(id) {
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
    [id,id]
  );
  return result;
}

module.exports = {
  get,
  getAll,
  getCommunicationResult,
  getIncidentResult
};
