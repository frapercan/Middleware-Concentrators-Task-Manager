
/**
 * @swagger
 * definitions:
 *   Study:
 *     type: object
 *     required:
 *       - id_estudio
 *       - nombre
 *       - fecha_insercion
 *       - total
 *       - finalizado_cerco
 *       - progreso_cerco
 *       - pendiente_cerco
 *     properties:
 *       id_paquete:
 *         type: number
 *       name:
 *         type: string
 *       currentPrice:
 *         type: number
 *       lastUpdate:
 *         type: number
 */
class Study {
    constructor (id_estudio, nombre,fecha_insercion,n_ciclos,ciclo_actual,fecha_inicio_ciclo, total, total_tareas , finalizado_tarea,progreso_tarea,pendiente_tarea,encolado_tarea) {
      this.id_estudio = id_estudio
      this.nombre = nombre,
      this.fecha_insercion = fecha_insercion,
      this.n_ciclos = n_ciclos,
      this.ciclo_actual = ciclo_actual,
      this.fecha_inicio_ciclo = fecha_inicio_ciclo
      this.total = total
      this.total_tareas = total_tareas
      this.finalizado_cerco = finalizado_tarea,
      this.progreso_cerco = progreso_tarea,
      this.pendiente_cerco = pendiente_tarea,
      this.encolado_tarea = encolado_tarea,
      this.progreso = finalizado_tarea / total_tareas
    }}


module.exports = Study