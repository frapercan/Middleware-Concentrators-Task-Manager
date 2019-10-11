const express = require("express");
const router = express.Router();
const studyService = require("./study.service");

// routes

/**
 * @swagger
 * /studies:
 *   get:
 *     description: Retrieve the full list of studies
 *     tags:
 *       - studies
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array
 *         schema:
 *           $ref: '#/definitions/Study'
 */
router.get("/:id", get);

router.get("/", getAll);
router.get("/:id/result", getCommunicationResult);
router.get("/:id/result/incident",getIncidentResult);

module.exports = router;

function get(req, res, next) {
  studyService
    .get(req.params.id)
    .then(study => res.json(study))
    .catch(err => next(err));
}

function getAll(req, res, next) {
  studyService
    .getAll()
    .then(studies => res.json(studies))
    .catch(err => next(err));
}

function getCommunicationResult(req, res, next) {
  studyService
    .getCommunicationResult(req.params.id)
    .then(result => res.json(result))
    .catch(err => next(err));
}

function getIncidentResult(req, res, next) {
  studyService
    .getIncidentResult(req.params.id)
    .then(result => res.json(result))
    .catch(err => next(err));
}
