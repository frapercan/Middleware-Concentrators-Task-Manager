/**
 * @swagger
 * definitions:
 *   Package:
 *     type: object
 *     required:
 *       - id_paquete
 *       - nombre
 *       - descripcion
 *       - fecha_insercion
 *     properties:
 *       id_paquete:
 *         type: number
 *       nombre:
 *         type: string
 *       descripcion:
 *         type: string
 *       fecha_insercion:
 *         type: date
 */
class Package {
  constructor(id_paquete, nombre, descripcion, fecha_insercion) {
    this.id_paquete = id_paquete;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.fecha_insercion = fecha_insercion;
  }
}

module.exports = Package;
