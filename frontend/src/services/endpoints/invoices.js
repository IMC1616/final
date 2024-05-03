import { apiSlice } from "../apiSlice";

const invoicesEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getInvoices: build.query({
      query: (url) => url,
      providesTags: (result) => [
        ...(Array.isArray(result?.data?.invoices)
          ? result.data.invoices.map((invoice) => ({
              type: "Invoice",
              id: invoice._id,
            }))
          : []),
        { type: "Invoice", id: "LIST" },
      ],
    }),
    getInvoiceById: build.query({
      query: (invoiceId) => `invoices/${invoiceId}`,
      providesTags: (result, error, invoiceId) => [
        { type: "Invoice", id: invoiceId },
      ],
    }),
    payInvoice: build.mutation({
      query: ({ invoiceId, invoiceType }) => {
        console.log(`URL: invoices/${invoiceId}/${invoiceType}/pay`); // Debugging the URL formation
        return {
          url: `invoices/${invoiceId}/${invoiceType}/pay`,
          method: "PUT",
        };
      },
      invalidatesTags: (result, error, { invoiceId }) => [
        { type: "Invoice", id: invoiceId },
        { type: "Report", id: "Unpaid" },
        { type: "Report", id: "Summary" },
      ],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  usePayInvoiceMutation,
} = invoicesEndpoint;
