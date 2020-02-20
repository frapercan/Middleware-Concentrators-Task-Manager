
/**
 * @swagger
 * definitions:
 *   Attribute:
 *     type: 
 *     required:
 *       - id
 *       - name
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 * 
 */

class Attribute {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}
module.exports = Attribute




