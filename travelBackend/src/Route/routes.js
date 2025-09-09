const express = require("express");
const { userRegister, userLogin } = require("../controller/user.controller");
const route = express.Router();
route.post("/register", userRegister);
route.post("/login", userLogin);
module.exports = route;