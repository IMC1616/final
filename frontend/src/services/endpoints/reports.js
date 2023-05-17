import { apiSlice } from "../apiSlice";

const reportsEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUnpaid: build.query({
      query: ({ startDate, endDate }) => ({
        url: `/reports/unpaid?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
      providesTags: [{ type: "Report", id: "Unpaid" }],
    }),
    getSummary: build.query({
      query: ({ startDate, endDate }) => ({
        url: `/reports/summary?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
      providesTags: [{ type: "Report", id: "Summary" }],
    }),
  }),
});

export const { useGetUnpaidQuery, useGetSummaryQuery } = reportsEndpoint;
