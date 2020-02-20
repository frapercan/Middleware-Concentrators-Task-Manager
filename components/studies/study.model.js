
/**
 * @swagger
 * definitions:
 *   Study:
 *     type: 
 *     required:
 *       - id
 *       - name
 *       - initialDate
 *       - loops
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 *       initialDate:
 *         type: date
 *       loops:
 *         type: number
 *       currentLoop:
 *         type: number
 *       start:
 *         type: number
 *       concentratorsAmount:
 *         type: number
 *       tasksAmount:
 *         type: number
 *       taskFinishedAmount:
 *         type: number
 *       taskProgressAmount:
 *         type: number
 *       taskPedingAmount:
 *         type: number
 *       taskQueuedAmount:
 *         type: number
 * 
 */

class Study {
  constructor(id, name, initialDate, loops, currentLoop, start, concentratorsAmount, taskFinishedAmount, taskProgressAmount, taskPendingAmount, taskQueuedAmount) {
    this.id = id;
    this.name = name;
    this.initialDate = initialDate;
    this.loops = loops;
    this.currentLoop = currentLoop;
    this.start = start;
    this.concentratorsAmount = concentratorsAmount;
    this.taskFinishedAmount = taskFinishedAmount;
    this.taskProgressAmount = taskProgressAmount;
    this.taskPendingAmount = taskPendingAmount;
    this.taskQueuedAmount = taskQueuedAmount;
  }

  getName() {
    return this.name;
  }


  getInitialDate() {
    return this.initialDate;
  }


  getLoops() {
    return this.loops;
  }

  getCurrentLoop() {
    return this.currentLoop;
  }

  getStart() {
    return this.start;
  }

  getConcentratorsAmount() {
    return this.concentratorsAmount;
  }


  getTaskFinishedAmount() {
    return this.taskFinishedAmount;
  }

  getTaskProgressAmount() {
    return this.taskProgressAmount;
  }

  getTaskPendingAmount() {
    return this.taskPendingAmount;
  }


  getTaskQueuedAmount() {
    return this.taskQueuedAmount;
  }

}





module.exports = Study




