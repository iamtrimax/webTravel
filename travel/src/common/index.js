const url_api = import.meta.env.VITE_APP_API_URL;
const sumaryApi = {
  login: {
    url: `${url_api}/login`,
    method: "POST",
  },
  adminLogin: {
    url: `${url_api}/admin/login`,
    method: "POST",
  },
  register: {
    url: `${url_api}/register`,
    method: "POST",
  },
  getUserDetails: {
    url: `${url_api}/userdetails`,
    method: "GET",
  },
  logout: {
    url: `${url_api}/logout`,
    method: "POST",
  },
  createTour: {
    url: `${url_api}/admin/tour`,
    method: "POST",
  },
  updateTour: {
    url: `${url_api}/admin/tour/:id`,

    method: "PUT",
  },
  deleteTour: {
    url: `${url_api}/admin/tour/:id`,
    method: "DELETE",
  },
  getAllTours: {
    url: `${url_api}/tours`,
    method: "GET",
  },
  getTourDetail: {
    url: `${url_api}/tour-detail/:id`,
    method: "GET",
  },
  toggleTourStatus: {
    url: `${url_api}/admin/tour/:id/status`,
    method: "PUT",
  },
  addReview: {
    url: `${url_api}/add-review/:id`,
    method: "POST",
  },
  getAllReview: {
    url: `${url_api}/get-all-review/:id`,
    method: "GET",
  },
  blockUser: {
    url: `${url_api}/admin/user/:id/block`,
    method: "POST",
  },
  unBlockUser: {
    url: `${url_api}/admin/user/:id/unblock`,
    method: "POST",
  },
  getAllUsers: {
    url: `${url_api}/admin/users`,
    method: "GET",
  },
  createUser: {
    url: `${url_api}/admin/user`,
    method: "POST",
  },
  toggleBlockUser: {
    url: `${url_api}/admin/user/:id/block`,
    method: "PUT",
  },
  updateRoleUser: {
    url: `${url_api}/admin/user/:id/role`,
    method: "PUT",
  },
  deleteUser: {
    url: `${url_api}/admin/user/:id`,
    method: "DELETE",
  },
  deleteImage: {
    url: `${url_api}/admin/cloudinary/image`,
    method: "DELETE",
  },
  getAllEmail: {
    url: `${url_api}/admin/emails`,
    method: "GET",
  },
  replyEmail: {
    url: `${url_api}/admin/replyemail`,
    method: "POST",
  },
  userSendMail: {
    url: `${url_api}/sendmail`,
    method: "POST",
  },
  booking: {
    url: `${url_api}/booking`,
    method: "POST",
  },
  allbooking: {
    url: `${url_api}/admin/allbooking`,
    method: "GET",
  },
  changeStatusBooking: {
    url: `${url_api}/admin/confirm/:id`,
    method: "PUT",
  },
  getBookingByAccount: {
    url: `${url_api}/get-booking-by-account`,
    method: "GET",
  },
};
export default sumaryApi;
