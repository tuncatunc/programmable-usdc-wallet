import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

export type Portfolio = {
  type: PortfolioType;
  index: number;  // Corresponds to portfolio index in BIP-44 path `m/44'/501'/${portfolio index}'/${subaccount index}'`;
  subaccounts: Subaccount[];
}

export interface PortfoliosState {
  portfolios: Portfolio[]
}

const initialState: PortfoliosState = {
  portfolios: []
}

export interface CreatePortfolioActionType {
  noAccounts: number;
  type: PortfolioType;
  goals: number[]
}

export const portfoliosSlice = createSlice({
  name: "portfolios",
  initialState,
  reducers: {
    createPortfolio: (state, action: PayloadAction<CreatePortfolioActionType>) => {
      // Build subaccounts
      const subaccounts: Subaccount[] = []
      for (let index = 0; index < action.payload.noAccounts; index++) {
        let subaccount: Subaccount = {
          index,
          goal: action.payload.goals[index],
        }
        subaccounts.push(subaccount)
      }

      // Add to portfolio
      const portfolio: Portfolio = {
        type: action.payload.type,
        index: state.portfolios.length,
        subaccounts: subaccounts
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const {createPortfolio} = portfoliosSlice.actions

export default portfoliosSlice.reducer
