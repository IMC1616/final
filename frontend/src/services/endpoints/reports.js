import { apiSlice } from "../apiSlice";

const reportsEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUnpaid: build.query({
      query: ({ startDate, endDate }) => ({
        url: `/reports/unpaid?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUnpaidQuery } = reportsEndpoint;
