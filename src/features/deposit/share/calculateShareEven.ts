import { decimals } from "../../../common/usdcMint"
import { IPortfolio } from "../../portfolio/portfolio"

export const calculateShareEven = (portfolio: IPortfolio, amount: number): bigint[] => {
  return portfolio.subaccounts.map(sa => BigInt(amount) / BigInt(portfolio.subaccounts.length) * decimals)
}
