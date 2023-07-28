const CustomError = require('../Helper/customError')
const util = require('util')
const jwt = require('jsonwebtoken')
const asyncverify = util.promisify(jwt.verify)
require('dotenv').config()
const secrtkey =process.env.secrtkey
//--------------------------------------------------------------
const ownAccount = async (req, res, next) => {
    const { authorization: token } = req.headers
    let decoded = await asyncverify(token, secrtkey);
    if (decoded.id!==req.params.id) {
        next(CustomError({
            stateCod: 401,
            message: "You do not own this account"
        }));
    }
    next();
}
module.exports = ownAccount ;
