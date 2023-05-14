import { apiSlice } from "../apiSlice";

const usersEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({
      query: (url) => url,
      providesTags: (result) => [
        ...result?.data?.users.map((user) => ({ type: "User", id: user._id })),
        { type: "User", id: "LIST" },
      ],
    }),
    getUserDebts: build.query({
      query: (id) => `/users/${id}/debts`,
      providesTags: (result, error, id) => [{ type: 'Debt', id }]

    }),
    createUser: build.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: build.mutation({
      query: (user) => ({
        url: `/users/${user._id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: (result) => [{ type: "User", id: result.data._id }],
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }],
    }),
  }),
});


export const {
  useGetUsersQuery,
  useGetUserDebtsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersEndpoint;
