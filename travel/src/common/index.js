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
    url: `${url_api}/admin/tours`,
    method: "GET",
  },
  toggleTourStatus: {
    url: `${url_api}/admin/tour/:id/status`,
    method: "PUT",
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
  toggleBlockUser:{
    url: `${url_api}/admin/user/:id/block`,
    method: "PUT",
  },
  updateRoleUser:{
    url: `${url_api}/admin/user/:id/role`,
    method: "PUT",
  },
  deleteUser:{
    url: `${url_api}/admin/user/:id`,
    method: "DELETE",
  },
  deleteImage:{
    url: `${url_api}/admin/cloudinary/image`,
    method: "DELETE",
  },
  getAllEmail:{
    url: `${url_api}/admin/emails`,
    method:"GET"
  }
};
export default sumaryApi;
