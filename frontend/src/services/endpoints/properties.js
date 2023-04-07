import { apiSlice } from "../apiSlice";

const propertiesEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProperties: build.query({
      query: () => ({
        url: "/properties",
        method: "GET",
      }),
    }),
    createProperty: build.mutation({
      query: (property) => ({
        url: "/properties",
        method: "POST",
        body: property,
      }),
    }),
    updateProperty: build.mutation({
      query: (property) => ({
        url: `/properties/${property.id}`,
        method: "PUT",
        body: property,
      }),
    }),
    deleteProperty: build.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
} = propertiesEndpoint;
