import { build } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IPortfolio } from "../portfolio/portfolio"

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Portfolios"],
  baseQuery: fetchBaseQuery({ baseUrl: "https://portfolio-usdc-wallet-be-tunca.vercel.app/api" }),
  // baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  endpoints: (builder) => ({
    getPortfolios: builder.query({
      query: (address: string) => `/portfolio/${address}`,
      transformResponse: (response: any, meta, arg) => {
        // _id fields are for the mongodb, strip them away 
        // delete _id fields
        return response.data.map(p => {
          delete p._id
          p.subaccounts = p.subaccounts.map(sa => {
            delete sa._id
            return sa
          })
          return p
        })
        return response.data;
      },
      providesTags: ["Portfolios"]
    }),
    createPortfolio: builder.mutation({
      query: (portfolio: IPortfolio) => ({
        url: `/portfolio`,
        method: "POST",
        body: portfolio
      }),
      invalidatesTags: ["Portfolios"]
    }),
    updatePortfolio: builder.mutation({
      query: (portfolio: IPortfolio) => ({
        url: `/portfolio`,
        method: "PUT",
        body: portfolio
      }),
      invalidatesTags: ["Portfolios"]
    })
  })
})

export const {
  useGetPortfoliosQuery,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation
} = apiSlice