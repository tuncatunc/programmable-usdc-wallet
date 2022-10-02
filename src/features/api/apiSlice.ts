import { build } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IPortfolio } from "../portfolio/portfolio"

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Portfolios"],
  baseQuery: fetchBaseQuery({ baseUrl: "https://portfolio-usdc-wallet-be-tunca.vercel.app/api" }),
  endpoints: (builder) => ({
    getPortfolios: builder.query({
      query: (address: string) => `/portfolio/${address}`,
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
  })
})

export const {
  useGetPortfoliosQuery,
  useCreatePortfolioMutation
} = apiSlice