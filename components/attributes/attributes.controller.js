const express = require("express");
const router = express.Router();
const attributeService = require("./attribute.service");


/**
 * @swagger
 * /attributes:
 *   get:
 *     description: Retrieve the full list of attributes
 *     tags:
 *       - Attributes
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: [Attribute]
 *         schema:
 *           $ref: '#/definitions/Attribute'
 */
router.get("/", getAll);






module.exports = router;


function getAll(req, res, next) {
  console.log('entra')
  attributeService
    .getAttributesList()
    .then(result => res.json(result))
    .catch(err => next(err));
}


