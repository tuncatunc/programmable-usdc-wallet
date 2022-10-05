import { Connection } from "@solana/web3.js";
import { IPortfolio, PortfolioType } from "../../portfolio/portfolio";
import { calculateShareEven } from "./calculateShareEven";
import { calculateShareRational } from "./calculateShareRational";
import { calculateShareRationalPriority } from "./calculateShareRationalPriority";

export const calculateShare = (
  portfolio: IPortfolio,
  amount: number,
  connection: Connection,
  mnemonic: string
): number[] => {
  switch (portfolio.type) {
    case PortfolioType.Even:
      return calculateShareEven(portfolio, amount)
      break;

    case PortfolioType.Rational:
      return calculateShareRational(portfolio, amount, connection)
      break;

    case PortfolioType.RationalPriority:
      return calculateShareRationalPriority(portfolio, amount, connection, mnemonic)
      break;

    default:
      return []
      break;
  }
  return []
}
