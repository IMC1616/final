import { apiSlice } from "../apiSlice";

const consumptionsEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getConsumptions: build.query({
      query: () => ({
        url: "/consumptions",
        method: "GET",
      }),
    }),
    createConsumption: build.mutation({
      query: (consumption) => ({
        url: "/consumptions",
        method: "POST",
        body: consumption,
      }),
    }),
    updateConsumption: build.mutation({
      query: (consumption) => ({
        url: `/consumptions/${consumption.id}`,
        method: "PUT",
        body: consumption,
      }),
    }),
    deleteConsumption: build.mutation({
      query: (id) => ({
        url: `/consumptions/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetConsumptionsQuery,
  useCreateConsumptionMutation,
  useUpdateConsumptionMutation,
  useDeleteConsumptionMutation,
} = consumptionsEndpoint;
