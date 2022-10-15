export enum PortfolioType {
  Even = "Evenly Distribution",
  Rational = "Rational Distribution",
  RationalPriority = "Waterfall Distribution"
};

export interface Subaccount {
  index: number;
  goal: number; // Valid for `Rational` & `RationalPriority`
  name: string
}

export type IPortfolio = {
  address: string,
  type: PortfolioType;
  name: string;
  index: number;  // Corresponds to portfolio index in BIP-44 path `m/44'/501'/${portfolio index}'/${subaccount index}'`;
  subaccounts: Subaccount[];
}

const initialState : IPortfolio[] = []
