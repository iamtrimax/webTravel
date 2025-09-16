const express = require("express");
const { userRegister, userLogin, userDetails, userLogout} = require("../controller/user.controller");
const verifyAccessToken = require("../middleware/verifyAccessToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const { createTour, getAllTours, updateTour } = require("../controller/tour.controller");
const { blockedUser, unBlockedUser } = require("../controller/admin.controller");
const route = express.Router();
route.post("/register", userRegister);
route.post("/login", userLogin);
route.get("/userdetails", verifyAccessToken, userDetails);
route.post("/logout", verifyAccessToken, userLogout);

//route admin
route.post("/admin/user/:id/block", verifyAccessToken, verifyAdmin ,blockedUser);
route.post("/admin/user/:id/unblock", verifyAccessToken, verifyAdmin ,unBlockedUser);
route.post("/admin/tour", verifyAccessToken, verifyAdmin, createTour);
route.put("/admin/tour/:id", verifyAccessToken, verifyAdmin, updateTour);
route.get("/admin/tours", verifyAccessToken, verifyAdmin, getAllTours);

module.exports = route;