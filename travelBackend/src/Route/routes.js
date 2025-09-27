const express = require("express");
const { userRegister, userLogin, userDetails, userLogout, sentEmail} = require("../controller/user.controller");
const verifyAccessToken = require("../middleware/verifyAccessToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const { createTour, getAllTours, updateTour, deleteTour, toggleTourStatus } = require("../controller/tour.controller");
const { adminLogin, getAllUsers, createUser, toggleBlockUser, updateRoleUser, deleteUser, deleteImage, getAllEmail } = require("../controller/admin.controller");
const { on } = require("../models/user.model");
const route = express.Router();

//route user
route.post("/register", userRegister);
route.post("/login", userLogin);
route.get("/userdetails", verifyAccessToken, userDetails);
route.post("/logout", verifyAccessToken, userLogout);
route.post("/sendmail", verifyAccessToken, sentEmail)

//route admin
route.post("/admin/login", adminLogin);
route.get("/admin/users", verifyAccessToken, verifyAdmin, getAllUsers);
route.post("/admin/user", verifyAccessToken, verifyAdmin, createUser);
route.put("/admin/user/:id/block", verifyAccessToken, verifyAdmin, toggleBlockUser);
route.put("/admin/user/:id/role", verifyAccessToken, verifyAdmin, updateRoleUser);
route.delete("/admin/user/:id", verifyAccessToken, verifyAdmin, deleteUser);
route.post("/admin/tour", verifyAccessToken, verifyAdmin, createTour);
route.put("/admin/tour/:id", verifyAccessToken, verifyAdmin, updateTour);
route.get("/admin/tours",getAllTours);
route.delete("/admin/tour/:id", verifyAccessToken, verifyAdmin, deleteTour);
route.put("/admin/tour/:id/status", verifyAccessToken, verifyAdmin, toggleTourStatus);
route.get("/admin/emails", verifyAccessToken, verifyAdmin, getAllEmail)

//cloudinary
route.delete("/admin/cloudinary/image", verifyAccessToken, verifyAdmin, deleteImage);

module.exports = route;