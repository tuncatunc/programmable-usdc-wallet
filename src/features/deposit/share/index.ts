import { Connection } from "@solana/web3.js";
import { IPortfolio, PortfolioType } from "../../portfolio/portfolio";
import { calculateShareEven } from "./calculateShareEven";
import { calculateShareRational } from "./calculateShareRational";
import { calculateShareRationalPriority } from "./calculateShareRationalPriority";

export const calculateShare = async (
  portfolio: IPortfolio,
  amount: number,
  connection: Connection,
  mnemonic: string
): Promise<number[]> => {
  switch (portfolio.type) {
    case PortfolioType.Even:
      return Promise.resolve(calculateShareEven(portfolio, amount))

    case PortfolioType.Rational:
      return Promise.resolve(calculateShareRational(portfolio, amount, connection))

    case PortfolioType.RationalPriority:
      return await calculateShareRationalPriority(portfolio, amount, connection, mnemonic)
      break;

    default:
      return []
      break;
  }
  return []
}
