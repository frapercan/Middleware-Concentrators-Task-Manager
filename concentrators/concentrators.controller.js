const express = require("express");
const router = express.Router();
const concentratorService = require("./concentrators.service");

// routes

/**
 * @swagger
 * /concentrators:
 *   get:
 *     description: Retrieve the full list of concentrators
 *     tags:
 *       - concentrators
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array
 *         schema:
 *           $ref: '#/definitions/Concentrator'
 */
router.get("/", getAll);
router.post("/concentrators", getConcentrators);
router.post("/package", getConcentratorsByPackage);

module.exports = router;



function getAll(req, res, next) {
  concentratorService
    .getAll()
    .then(concentrators => res.json(concentrators))
    .catch(err => next(err));
}


function getConcentrators(req, res, next) {
  concentratorService
    .getConcentrators(req.body)
    .then(concentrators => res.json(concentrators))
    .catch(err => next(err));
}

function getConcentratorsByPackage(req, res, next) {
  concentratorService
    .getConcentratorsByPackage(req.body)
    .then(concentrators => res.json(concentrators))
    .catch(err => next(err));
}

