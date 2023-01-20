// Require
const Router = require("express").Router();

const Test = require("./test/index");

Router.use("/test", Test);

module.exports = Router;
