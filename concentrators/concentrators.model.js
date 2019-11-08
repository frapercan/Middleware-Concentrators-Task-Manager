
/**
 * @swagger
 * definitions:
 *   Concentrator:
 *     type: object
 *     required:
 *       - id_concentrador
 *       - lvcid
 *     properties:
 *       id_paquete:
 *         type: number
 *       lvcid:
 *         type: string
 */
class Concentrator {
    constructor (id_concentrador, lvcid) {
      this.id_concentrador = id_concentrador
      this.lvcid = lvcid
    }}


module.exports = Concentrator