const CustomError = require("../Helper/customError");
const util = require("util");
const jwt = require("jsonwebtoken");
const asyncverify = util.promisify(jwt.verify);
require("dotenv").config();
const secrtkey = process.env.secrtkey;
//--------------------------------------------------------------
const admin = async (req, res, next) => {
const { authorization: token } = req.headers;
let decoded = await asyncverify(token, secrtkey);
if (decoded.Role !== "admin") {
next(
    CustomError({
    stateCod: 401,
    message: "Not an admin or the id does not match",
    })
);
}
next();
};
//--------------------------------------------------------------
module.exports = admin;
