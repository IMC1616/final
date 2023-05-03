import { apiSlice } from "../apiSlice";

const consumptionsEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getConsumptions: build.query({
      query: () => ({
        url: "/consumptions",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetConsumptionsQuery,
} = consumptionsEndpoint;
