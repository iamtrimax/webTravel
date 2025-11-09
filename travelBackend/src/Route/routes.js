const express = require("express");
const { userRegister, userLogin, userDetails, userLogout, sentEmail} = require("../controller/user.controller");
const verifyAccessToken = require("../middleware/verifyAccessToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const { createTour, getAllTours, updateTour, deleteTour, toggleTourStatus, getTourDetail, addReview, getAllReview, deleteReview } = require("../controller/tour.controller");
const { adminLogin, getAllUsers, createUser, toggleBlockUser, updateRoleUser, deleteUser, deleteImage, getAllEmail, replyEmail } = require("../controller/admin.controller");
const { createBooking, getAllBooking, changeStatusBooking, getBookingByAccount, cancelBooking, changePayStatus } = require("../controller/booking.controller");
const { postShare, getAllPosts, likePost, deletePost, postComment, deleteComment } = require("../controller/post.controller");
const { AIChat } = require("../controller/AI.controller");
const { createPayment, vnpayReturn, vnpayIpn } = require("../controller/payment.controller");
const route = express.Router();

//route user
route.post("/register", userRegister);
route.post("/login", userLogin);
route.get("/tour-detail/:id", getTourDetail)
route.get("/tours",getAllTours);
route.get("/get-all-review/:id", getAllReview)
route.get("/posts", getAllPosts);

route.post("/sendmail", verifyAccessToken, sentEmail)
route.get("/userdetails", verifyAccessToken, userDetails);
route.post("/logout", verifyAccessToken, userLogout);
route.post("/booking",verifyAccessToken,createBooking)
route.get("/get-booking-by-account", verifyAccessToken, getBookingByAccount)
route.post("/add-review/:id", verifyAccessToken, addReview)
route.delete("/delete-review/:id/:userId", verifyAccessToken, deleteReview)
route.post("/post", verifyAccessToken, postShare);
route.post("/like-post/:id", verifyAccessToken, likePost);
route.delete("/post/:id", verifyAccessToken, deletePost);
route.post("/comment-post/:id", verifyAccessToken, postComment);
route.delete("/comment-post/:id/:commentId", verifyAccessToken, deleteComment);
route.delete("/cancel-booking/:id", verifyAccessToken, cancelBooking)

//route admin
route.post("/admin/login", adminLogin);
route.get("/admin/users", verifyAccessToken, verifyAdmin, getAllUsers);
route.post("/admin/user", verifyAccessToken, verifyAdmin, createUser);
route.put("/admin/user/:id/block", verifyAccessToken, verifyAdmin, toggleBlockUser);
route.put("/admin/user/:id/role", verifyAccessToken, verifyAdmin, updateRoleUser);
route.delete("/admin/user/:id", verifyAccessToken, verifyAdmin, deleteUser);
route.post("/admin/tour", verifyAccessToken, verifyAdmin, createTour);
route.put("/admin/tour/:id", verifyAccessToken, verifyAdmin, updateTour);
route.delete("/admin/tour/:id", verifyAccessToken, verifyAdmin, deleteTour);
route.put("/admin/tour/:id/status", verifyAccessToken, verifyAdmin, toggleTourStatus);
route.get("/admin/emails", verifyAccessToken, verifyAdmin, getAllEmail)
route.post("/admin/replyemail",verifyAccessToken, verifyAdmin, replyEmail)
route.get("/admin/allbooking", verifyAccessToken, verifyAdmin,getAllBooking)
route.put("/admin/confirm/:id", verifyAccessToken, verifyAdmin, changeStatusBooking)
route.put("/admin/change-pay-status/:id", verifyAccessToken, verifyAdmin, changePayStatus)

//cloudinary
route.delete("/admin/cloudinary/image", verifyAccessToken, verifyAdmin, deleteImage);

//vnpay
route.get("/payment/vnpay_return", vnpayReturn);
route.get("/payment/vnpay_ipn",vnpayIpn)
route.post("/payment/create", verifyAccessToken, createPayment);
//chatbot AI
route.post("/chat", AIChat)

module.exports = route;