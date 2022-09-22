import { configureStore } from '@reduxjs/toolkit'
import portfolioReducer from "../features/portfolio/portfolioSlice"
import mnemonicReducer from "../features/mnemonic/mnemonicSlice"

export const store = configureStore({
  reducer: {
    portfolios: portfolioReducer,
    mnemonic: mnemonicReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch