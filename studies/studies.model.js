
/**
 * @swagger
 * definitions:
 *   Study:
 *     type: object
 *     required:
 *       - id_estudio
 *       - nombre
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
    constructor (id_estudio, nombre,fecha_insercion,n_ciclos, total_cerco, finalizado_cerco,progreso_cerco,pendiente_cerco, progreso) {
      this.id_estudio = id_estudio
      this.nombre = nombre,
      this.fecha_insercion = fecha_insercion,
      this.n_ciclos = n_ciclos,
      this.total_cerco = total_cerco
      this.finalizado_cerco = finalizado_cerco,
      this.progreso_cerco = progreso_cerco,
      this.pendiente_cerco = pendiente_cerco,
      this.progreso = progreso
    }}


module.exports = Study