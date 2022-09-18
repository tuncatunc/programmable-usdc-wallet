import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import internal from "stream";

export enum PortfolioType {
  Even = "Even",
  Rational = "Rational",
  RationalPriority = "Rational Priority"
};

export interface Subaccount {
  index: number;
  goal: number; // Valid for `Rational` & `RationalPriority`
}

export type IPortfolio = {
  type: PortfolioType;
  index: number;  // Corresponds to portfolio index in BIP-44 path `m/44'/501'/${portfolio index}'/${subaccount index}'`;
  subaccounts: Subaccount[];
}

const initialState : IPortfolio[] = []


export const portfoliosSlice = createSlice({
  name: "portfolios",
  initialState,
  reducers: {
    createPortfolio: (state, action: PayloadAction<IPortfolio>) => {
      state.push(action.payload)
    }
  }
})

// Action creators are generated for each case reducer function
export const {createPortfolio} = portfoliosSlice.actions

export default portfoliosSlice.reducer
