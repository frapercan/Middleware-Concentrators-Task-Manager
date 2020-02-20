
/**
 * @swagger
 * definitions:
 *   Issue:
 *     type: 
 *     required:
 *       - id
 *       - name
 *       - description
 *       - group
 *       - priority
 *       - detect
 *       - fix
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
 *       detect:
 *         type: array
 *       fix:
 *         type: array
 * 
 */

class Issue {
  constructor(id, name, description, group, priority, detect, fix ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.group = group;
    this.priority = priority;
    this.detect = detect;
    this.fix = fix;
  }
}





module.exports = Issue




