const express = require("express");
const { userRegister, userLogin, userDetails, userLogout, blockedUser } = require("../controller/user.controller");
const verifyAccessToken = require("../middleware/verifyAccessToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const route = express.Router();
route.post("/register", userRegister);
route.post("/login", userLogin);
route.get("/userdetails", verifyAccessToken, userDetails);
route.post("/logout", verifyAccessToken, userLogout);

//route admin
route.post("/admin/user/:id/block", verifyAccessToken, verifyAdmin ,blockedUser);

module.exports = route;