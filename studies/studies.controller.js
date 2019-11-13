const express = require("express");
const router = express.Router();
const studyService = require("./study.service");

router.get("/issues", getIssuesList);
router.get("/:id", get);
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
router.get("/", getAll);
router.post("/", createStudy);
router.get("/:id/result", getCommunicationResult);
router.get("/:id/result/issues", getIssueResult);
router.get("/:id/result/ciclos", getCiclosInfo);


module.exports = router;

function get(req, res, next) {
  studyService
    .get(req.params.id)
    .then(study => res.json(study))
    .catch(err => next(err));
}

function createStudy(req, res, next) {
  console.log(req.body);
  studyService
    .createStudy(req.body)
    .then(study =>
      study
        ? res.json(study)
        : res.status(400).json({ message: "not valid study" })
    )
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

function getIssueResult(req, res, next) {
  studyService
    .getIssuesResult(req.params.id)
    .then(result => res.json(result))
    .catch(err => next(err));
}

function getIssuesList(req, res, next) {
  studyService
    .getIssuesList(req.params.id)
    .then(result => res.json(result))
    .catch(err => next(err));
}

function getCiclosInfo(req, res, next) {
  studyService
    .getCiclosInfo(req.params.id)
    .then(result => res.json(result))
    .catch(err => next(err));
}
