import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import internal from "stream";

enum PortfolioType {
  Even,
  Rational,
  RationalPriority
};

class Subaccount {
  public index: number;   // Corresponds to portfolio index in BIP-44 path `m/44'/501'/${portfolio index}'/${subaccount index}'`;
  public targetAmount: number; // Valid for `Rational` & `RationalPriority`
  public isPriority: boolean;

  public constructor(index: number, targetAmount: number, isPriority: boolean) {
    this.index = index;
    this.targetAmount = targetAmount;
    this.isPriority = isPriority;
  }
}

class Portfolio {
  public type: PortfolioType;
  public index: number;  // Corresponds to portfolio index in BIP-44 path `m/44'/501'/${portfolio index}'/${subaccount index}'`;
  public accounts: Subaccount[];

  public constructor(type: PortfolioType, index: number, accounts: Subaccount[])
  {
    this.type = type;
    this.index = index;
    this.accounts = accounts;
  }
}

export interface PortfolioState {
  portfolios: Portfolio[]
}

const initialState: PortfolioState = {
  portfolios: []
}

interface CreatePortfolioActionType {
  noAccounts: number;
  type: PortfolioType
}

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    createPortfolio: (state, action: PayloadAction<CreatePortfolioActionType>) => {
      const subaccounts: Subaccount[] = []
      for (let index = 0; index < action.payload.noAccounts; index++) {
        subaccounts.push(new Subaccount(index, ))
        
      }
      const accounts: Subaccount = {
        index
      }

      const portfolio: Portfolio = {
        type: action.payload.type,
        index: state.portfolios.length,
        accounts
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const {increment, decrement, incrementByAmount} = counterSlice.actions

export default counterSlice.reducer
