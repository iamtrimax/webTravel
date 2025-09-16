const url_api = import.meta.env.VITE_APP_API_URL;
const sumaryApi = {
  login: {
    url: `${url_api}/login`,
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
  getAllTours: {
    url: `${url_api}/admin/tours`,
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
};
export default sumaryApi;
