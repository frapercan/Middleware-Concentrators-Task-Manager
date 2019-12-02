const express = require("express");
const router = express.Router();
const packageService = require("./packages.service");

// routes

/**
 * @swagger
 * /packages:
 *   get:
 *     description: Retrieve the full list of packages
 *     tags:
 *       - packages
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array
 *         schema:
 *           $ref: '#/definitions/Package'
 */
router.get("/", getAll);
 

module.exports = router;



function getAll(req, res, next) {
  packageService
    .getAll()
    .then(packages => res.json(packages))
    .catch(err => next(err));
}



