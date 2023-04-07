import { apiSlice } from "../apiSlice";

const categoriesEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
    }),
    createCategory: build.mutation({
      query: (category) => ({
        url: "/categories",
        method: "POST",
        body: category,
      }),
    }),
    updateCategory: build.mutation({
      query: (category) => ({
        url: `/categories/${category.id}`,
        method: "PUT",
        body: category,
      }),
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesEndpoint;
