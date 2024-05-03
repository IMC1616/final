import { apiSlice } from "../apiSlice";

const reconnectionEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getReconnections: build.query({
      query: (url) => url,
      providesTags: (result) => [
        ...result?.data?.reconnections.map((reconnection) => ({
          type: "Reconnection",
          id: reconnection._id,
        })),
        { type: "Reconnection", id: "LIST" },
      ],
    }),
    createReconnection: build.mutation({
      query: (reconnection) => ({
        url: "/reconnections",
        method: "POST",
        body: reconnection,
      }),
      invalidatesTags: [{ type: "Reconnection", id: "LIST" }],
    }),
    updateReconnection: build.mutation({
      query: (reconnection) => ({
        url: `/reconnections/${reconnection._id}`,
        method: "PUT",
        body: reconnection,
      }),
      invalidatesTags: (result) => [
        { type: "Reconnection", id: result.data._id },
      ],
    }),
    deleteReconnection: build.mutation({
      query: (id) => ({
        url: `/reconnections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Reconnection", id }],
    }),
  }),
});

export const {
  useGetReconnectionsQuery,
  useCreateReconnectionMutation,
  useUpdateReconnectionMutation,
  useDeleteReconnectionMutation,
} = reconnectionEndpoint;
