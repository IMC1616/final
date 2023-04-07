import { apiSlice } from "../apiSlice";

const metersEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMeters: build.query({
      query: () => ({
        url: "/meters",
        method: "GET",
      }),
    }),
    createMeter: build.mutation({
      query: (meter) => ({
        url: "/meters",
        method: "POST",
        body: meter,
      }),
    }),
    updateMeter: build.mutation({
      query: (meter) => ({
        url: `/meters/${meter.id}`,
        method: "PUT",
        body: meter,
      }),
    }),
    deleteMeter: build.mutation({
      query: (id) => ({
        url: `/meters/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetMetersQuery,
  useCreateMeterMutation,
  useUpdateMeterMutation,
  useDeleteMeterMutation,
} = metersEndpoint;
