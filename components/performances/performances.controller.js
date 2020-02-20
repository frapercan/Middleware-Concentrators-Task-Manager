const express = require("express");
const router = express.Router();
const performanceService = require("./performance.service");



/**
 * @swagger
 * /performances:
 *   get:
 *     description: Retrieve the full list performances
 *     tags:
 *       - Performances
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: [Performance]
 *         schema:
 *           $ref: '#/definitions/Performance'
 */
router.get("/", getAll);



/**
 * @swagger
 * /performances/{id}:
 *   get:
 *     description: Get the performances results of the study with the ID provided
 *     tags:
 *       - Performances
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the study
 *         required: true
 *         type: Integer
 *     responses:
 *       200:
 *         description: loop:name:result
 */
router.get("/:id", getPerformancesResult);



module.exports = router;


function getAll(req, res, next) {
  performanceService
    .getPerformancesList()
    .then(result => res.json(result))
    .catch(err => next(err));
}


function getPerformancesResult(req, res, next) {
  performanceService
    .getPerformancesResult(req.params.id)
    .then(result => res.json(result))
    .catch(err => next(err));
}