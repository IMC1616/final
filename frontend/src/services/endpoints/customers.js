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
    getCustomerById: build.query({
      query: (id) => `/customers/${id}`,
      providesTags: (result) => [{ type: "Customer", id: result.data._id }],
    }),
    getCustomerProperties: build.query({
      query: (id) => `/customers/${id}/properties`,
      providesTags: (result) => [
        ...result?.data?.map((property) => ({
          type: "Property",
          id: property._id,
        })),
        { type: "Property", id: "LIST" },
      ],
    }),
    createCustomerProperty: build.mutation({
      query: (property) => ({
        url: "/properties",
        method: "POST",
        body: property,
      }),
      invalidatesTags: (result) => [
        { type: "Property", id: "LIST" },
        { type: "Property", id: result.data._id },
      ],
    }),
    updateCustomerProperty: build.mutation({
      query: (property) => ({
        url: `/properties/${property._id}`,
        method: "PUT",
        body: property,
      }),
      invalidatesTags: (result) => [
        { type: "Property", id: "LIST" },
        { type: "Property", id: result.data._id },
      ],
    }),
    deleteCustomerProperty: build.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Property", id }],
    }),
    getCustomerMeters: build.query({
      query: (id) => `/customers/${id}/meters`,
      providesTags: (result) => [
        ...result?.data?.meters.map((meter) => ({
          type: "Meter",
          id: meter._id,
        })),
        { type: "Meter", id: "LIST" },
      ],
    }),
    getCustomerConsumptions: build.query({
      query: (id) => `/customers/${id}/consumptions`,
      providesTags: (result) => [
        ...result?.data?.consumptions.map((consumption) => ({
          type: "Consumption",
          id: consumption._id,
        })),
        { type: "Consumption", id: "LIST" },
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
  useGetCustomerByIdQuery,
  useGetCustomerPropertiesQuery,
  useCreateCustomerPropertyMutation,
  useUpdateCustomerPropertyMutation,
  useDeleteCustomerPropertyMutation,
  useGetCustomerMetersQuery,
  useGetCustomerConsumptionsQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersEndpoint;
