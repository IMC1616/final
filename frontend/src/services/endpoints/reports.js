import { apiSlice } from "../apiSlice";

const reportsEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getReport: build.query({
      query: (url) => url,
      providesTags: [{ type: "Report", id: "Report" }],
    }),
    getUnpaid: build.query({
      query: ({ startDate, endDate }) => ({
        url: `/reports/unpaid?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
      providesTags: [{ type: "Report", id: "Unpaid" }],
    }),
    getIncomes: build.query({
      query: ({ startDate, endDate }) => ({
        url: `/reports/income?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
      providesTags: [{ type: "Report", id: "Incomes" }],
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

export const {
  useGetReportQuery,
  useGetUnpaidQuery,
  useGetIncomesQuery,
  useGetSummaryQuery,
} = reportsEndpoint;
