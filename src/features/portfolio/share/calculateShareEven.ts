import { IPortfolio } from "../portfolio"

export const calculateShareEven = (portfolio: IPortfolio, amount: number): number[] => {
  return portfolio.subaccounts.map(sa => Math.floor(amount / portfolio.subaccounts.length))
}
