
/**
 * @swagger
 * definitions:
 *   Study:
 *     type: object
 *     required:
 *       - id_paquete
 *       - nombre_estudio
 *       - fecha_insercion
 *       - total_cerco
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
    constructor (id_paquete, nombre_estudio,fecha_insercion,id_tipo_periodicidad, total_cerco, finalizado_cerco,progreso_cerco,pendiente_cerco, progreso) {
      this.id_paquete = id_paquete
      this.nombre_estudio = nombre_estudio,
      this.fecha_insercion = fecha_insercion,
      this.id_tipo_periodicidad = id_tipo_periodicidad,
      this.total_cerco = total_cerco
      this.finalizado_cerco = finalizado_cerco,
      this.progreso_cerco = progreso_cerco,
      this.pendiente_cerco = pendiente_cerco,
      this.progreso = progreso
    }}


module.exports = Study