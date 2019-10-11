"SELECT 
    a.nombre_estado_tarea_paquete_cerco_finalizado, b.count
FROM
    0_MASTER_GAP_v2.1_1_0_estado_tareas_paquete_cerco_finalizado a
        LEFT JOIN
    (SELECT 
        id_estado_tareas_paquete_cerco_finalizado,
            COUNT(id_estado_tareas_paquete_cerco) AS count
    FROM
        0_MASTER_GAP_v2.1_0_concentradores_paquete
    WHERE
        id_paquete = 362
            AND id_estado_tareas_paquete_cerco = 3
    GROUP BY id_estado_tareas_paquete_cerco_finalizado) b ON a.id_estado_tarea_paquete_cerco_finalizado = b.id_estado_tareas_paquete_cerco_finalizado 
UNION (SELECT 
    'Pending' AS Pending, SUM(a.count)
FROM
    (SELECT 
        id_estado_tareas_paquete_cerco,
            COUNT(id_estado_tareas_paquete_cerco) AS count
    FROM
        0_MASTER_GAP_v2.1_0_concentradores_paquete
    WHERE
        id_paquete = 362
            AND id_estado_tareas_paquete_cerco != 3
    GROUP BY id_estado_tareas_paquete_cerco) a)
UNION (SELECT 
    'Accesible' AS Accesible, SUM(a.count)
FROM
    (SELECT 
        id_estado_tareas_paquete_cerco,
            COUNT(id_estado_tareas_paquete_cerco) AS count
    FROM
        0_MASTER_GAP_v2.1_0_concentradores_paquete
    WHERE
        id_paquete = 362
            AND id_estado_tareas_paquete_cerco = 3 and id_estado_tareas_paquete_cerco_finalizado = 1
    GROUP BY id_estado_tareas_paquete_cerco) a);
    
    "