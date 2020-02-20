const express = require("express");
const router = express.Router();
const issueService = require("./issue.service");

/**
 * @swagger
 * /issues:
 *   get:
 *     description: Retrieve the full list issues
 *     tags:
 *       - Issues
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: [Issue]
 *         schema:
 *           $ref: '#/definitions/Issue'
 */
router.get("/", getAll);

/**
 * @swagger
 * /issues/groups:
 *   get:
 *     description: Retrieve the groups of issues
 *     tags:
 *       - Issues
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: [Issue]
 *         schema:
 *           $ref: '#/definitions/Issue'
 */
router.get("/groups", getIssuesGroupsList);


/**
 * @swagger
 * /issues/{id}:
 *   get:
 *     description: Get the results of the study with the ID provided
 *     tags:
 *       - Issues
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
router.get("/:id", getIssuesResult);
router.get("/:id/overview", getIssuesResultOverview);


module.exports = router;



function getAll(req, res, next) {
  issueService
    .getIssuesList()
    .then(result => res.json(result))
    .catch(err => next(err));
}

function getIssuesGroupsList(req, res, next) {
  issueService
    .getIssuesGroupsList()
    .then(result => res.json(result))
    .catch(err => next(err));
}

function getIssuesResult(req, res, next) {
  issueService
    .getIssuesResult(req.params.id)
    .then(result => res.json(result))
    .catch(err => next(err));
}

function getIssuesResultOverview(req, res, next) {
  issueService
    .getIssuesResultOverview(req.params.id)
    .then(result => res.json(result))
    .catch(err => next(err));
}