import { apiSlice } from "../apiSlice";

const customersEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCustomers: build.query({
      query: (url) => url,
      providesTags: (result) => [
        ...result?.data?.customers.map((customer) => ({
          type: "Customer",
          id: customer._id,
        })),
        { type: "Customer", id: "LIST" },
      ],
    }),
    createCustomer: build.mutation({
      query: (customer) => ({
        url: "/customers",
        method: "POST",
        body: customer,
      }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
    updateCustomer: build.mutation({
      query: (customer) => ({
        url: `/customers/${customer._id}`,
        method: "PUT",
        body: customer,
      }),
      invalidatesTags: (result) => [{ type: "Customer", id: result.data._id }],
    }),
    deleteCustomer: build.mutation({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Customer", id }],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersEndpoint;
