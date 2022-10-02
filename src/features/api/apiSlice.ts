import { build } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IPortfolio } from "../portfolio/portfolioSlice"

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://portfolio-usdc-wallet-be-tunca.vercel.app/api" }),
  endpoints: (builder) => ({
    getPortfolios: builder.query({
      query: (address: string) => `/portfolio/${address}`
    }),
    createPortfolio: builder.mutation({
      query: (portfolio: IPortfolio) => ({
        url: `/portfolio`,
        metho: "POST",
        body: portfolio
      })
    }),
  })
})

export const {
  useGetPortfoliosQuery,
  useCreatePortfolioMutation
} = apiSlice