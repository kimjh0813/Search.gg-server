// Require
const Router = require("express").Router();

const Test = require("./test/index");
const Lol = require("./lol/index");

Router.use("/test", Test);
Router.use("/lol", Lol);

module.exports = Router;
