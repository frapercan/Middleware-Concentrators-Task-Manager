const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       id:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: integer
 *       createdDate:
 *         type: string
 *         format: date-time
 */
const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);