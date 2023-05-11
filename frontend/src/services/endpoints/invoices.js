import { apiSlice } from "../apiSlice";

const invoicesEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getInvoices: build.query({
      query: (url) => url,
      providesTags: (result) => [
        ...result?.data?.invoices.map((invoice) => ({
          type: "Invoice",
          id: invoice._id,
        })),
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
      query: (invoiceId) => ({
        url: `invoices/${invoiceId}/pay`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, invoiceId) => [
        { type: "Invoice", id: invoiceId },
      ],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  usePayInvoiceMutation,
} = invoicesEndpoint;
