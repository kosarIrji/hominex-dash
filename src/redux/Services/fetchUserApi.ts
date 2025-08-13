// RTK query will be added for upcoming updates

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const fetchUserApi = createApi({
//   reducerPath: "fetchUserApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://example.com/api",
//     prepareHeaders: (headers) => {
//       // Grab token from cookies (client-side)
//       const token = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("token="))
//         ?.split("=")[1];

//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     getUsers: builder.query<any, void>({
//       query: () => "/users",
//     }),
//   }),
// });

// export const { useGetUsersQuery } = fetchUserApi;
