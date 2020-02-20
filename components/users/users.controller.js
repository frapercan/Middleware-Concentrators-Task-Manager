const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes




/**
 * @swagger
 * /users/authenticate:
 *   post:
 *     description: Retreive user info  bearer token
 *     tags:
 *       - auth
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:      # Request body contents
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:   # Sample object
 *               username: xaxi
 *               password: password
 *     responses:
 *       200:
 *         description: User
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.post('/authenticate', authenticate);




router.post('/register', register);



/**
 * @swagger
 * /users:
 *   get:
 *     description: Retrieve the full list of users
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Array
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', get);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;




function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function get(req, res, next) {
    userService.get(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}