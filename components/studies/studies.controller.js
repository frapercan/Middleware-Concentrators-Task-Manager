const express = require("express");
const router = express.Router();
const studiesService = require("./study.service");


/**
 * @swagger
 * /studies:
 *   get:
 *     description: Retrieve the full list of studies
 *     tags:
 *       - Studies
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: [Study]
 *         schema:
 *           $ref: '#/definitions/Study'
 */
router.get("/", getAll);


/**
 * @swagger
 * /studies:
 *   post:
 *     description: Create study. (too complex too test it through API)
 *     tags:
 *       - Studies
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: body
 *         description: ID of the study to return
 *         required: true
 *         type: Integer
 *       
 *       
 *     responses:
 *       200:
 *         description: Study
 *         schema:
 *           $ref: '#/definitions/Study'
 */
router.post("/", createStudy);



/**
 * @swagger
 * /studies/{id}:
 *   get:
 *     description: Find a study by ID
 *     tags:
 *       - Studies
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the study to return
 *         required: true
 *         type: Integer
 *       
 *       
 *     responses:
 *       200:
 *         description: Study
 *         schema:
 *           $ref: '#/definitions/Study'
 */
router.get("/:id", get);
router.get("/:id/communication", getCommunicationResult);
router.get("/:id/loops", getLoopsInfo);
router.get("/:id/communication/overview", getCommunicationResultOverview);

module.exports = router;

function get(req, res, next) {
  studiesService
    .get(req.params.id)
    .then(study => res.json(study))
    .catch(err => next(err));
}

function createStudy(req, res, next) {
  studiesService
    .create(req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}

function getAll(req, res, next) {
  studiesService
    .getAll()
    .then(studies => res.json(studies))
    .catch(err => next(err));
}

function getCommunicationResult(req, res, next) {
  studiesService
    .getCommunicationResult(req.params.id)
    .then(result => res.json(result))
    .catch(err => next(err));
}

function getCommunicationResultOverview(req, res, next) {
  studiesService
    .getCommunicationResultOverview(req.params.id)
    .then(result => res.json(result))
    .catch(err => next(err));
}

function getLoopsInfo(req, res, next) {
  studiesService
    .getCiclosInfo(req.params.id)
    .then(result => res.json(result))
    .catch(err => next(err));
}
