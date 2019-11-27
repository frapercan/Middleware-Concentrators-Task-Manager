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

module.exports = router;



function getAll(req, res, next) {
  concentratorService
    .getAll()
    .then(studies => res.json(studies))
    .catch(err => next(err));
}


function getConcentrators(req, res, next) {
  concentratorService
    .getConcentrators(req.body)
    .then(studies => res.json(studies))
    .catch(err => next(err));
}

