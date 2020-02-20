
/**
 * @swagger
 * definitions:
 *   Performance:
 *     type: 
 *     required:
 *       - id
 *       - name
 *       - description
 *       - group
 *       - priority
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       group:
 *         type: number
 *       priority:
 *         type: number
 * 
 */

class Performance {
  constructor(id, name, description, group, priority ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.group = group;
    this.priority = priority;

  }
}





module.exports = Performance




