import { apiSlice } from "../apiSlice";

const categoriesEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query({
      query: (url) =>  url,
      providesTags: (result) => [
        ...result?.data?.categories.map((category) => ({
          type: "Category",
          id: category._id,
        })),
        { type: "Category", id: "LIST" },
      ],
    }),
    createCategory: build.mutation({
      query: (category) => ({
        url: "/categories",
        method: "POST",
        body: category,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: build.mutation({
      query: (category) => ({
        url: `/categories/${category._id}`,
        method: "PUT",
        body: category,
      }),
      invalidatesTags: (result) => [{ type: "Category", id: result.data._id }],
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Category", id }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesEndpoint;
