const expressJwt = require('express-jwt');
require('dotenv-safe').config();
const userService = require('components/users/user.service');

module.exports = jwt;

function jwt() {
    const secret = process.env.SECRET
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            '/api',
            '/api-docs',
            '/users'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.get(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};