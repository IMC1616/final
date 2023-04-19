import { apiSlice } from "../apiSlice";

const propertiesEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProperties: build.query({
      query: () => ({
        url: "/properties",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPropertiesQuery } = propertiesEndpoint;
