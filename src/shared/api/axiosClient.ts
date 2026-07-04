
// import axios from "axios";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const axiosClient = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });
// axiosClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;   
//     const publicRoutes = [
//       "/mechanic/login",
//       "/service-center/login",
//       "/admin/login",
//       "/register",
//       "/verify-otp",
//       "/resend-otp",
//       "/forgot-password",
//       "/reset-password",
//     ];
//     if (
//       publicRoutes.some((route) =>
//         originalRequest?.url?.includes(route)
//       )
//     ) {
//       return Promise.reject(error);
//     }

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         await axios.post(
//           `${BASE_URL}/refresh-token`,
//           {},
//           {
//             withCredentials: true,
//           }
//         );

//         return axiosClient(originalRequest);
//       } catch (err) {
//         const currentPath = window.location.pathname;

//         if (currentPath.startsWith("/admin")) {
//           window.location.href = "/admin/login";
//         } else if (currentPath.startsWith("/service-center")) {
//           window.location.href = "/service-center/login";
//         } else if (currentPath.startsWith("/mechanic")) {
//           window.location.href = "/mechanic/login";
//         } else {
//           window.location.href = "/login";
//         }

//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
// export default axiosClient;

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const publicRoutes = [
      "/mechanic/login",
      "/service-center/login",
      "/service-center/register",
      "/service-center/forgot-password",
      "/service-center/reset-password",
      "/admin/login",
      "/register",
      "/verify-otp",
      "/resend-otp",
      "/forgot-password",
      "/reset-password",
    ];

    if (publicRoutes.some((route) => originalRequest?.url?.includes(route))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const currentPath = window.location.pathname;
      let refreshUrl = `${BASE_URL}/refresh-token`;

      if (currentPath.startsWith("/admin")) {
        refreshUrl = `${BASE_URL}/admin/refresh-token`;
      } else if (currentPath.startsWith("/service-center")) {
        refreshUrl = `${BASE_URL}/service-center/refresh-token`;
      } else if (currentPath.startsWith("/mechanic")) {
        refreshUrl = `${BASE_URL}/mechanic/refresh-token`;
      }

      try {
        await axios.post(refreshUrl, {}, { withCredentials: true });
        return axiosClient(originalRequest);
      } catch (err) {
        if (currentPath.startsWith("/admin")) {
          window.location.href = "/admin/login";
        } else if (currentPath.startsWith("/service-center")) {
          window.location.href = "/service-center/login";
        } else if (currentPath.startsWith("/mechanic")) {
          window.location.href = "/mechanic/login";
        } else {
          window.location.href = "/login";
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;