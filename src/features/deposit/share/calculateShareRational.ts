import { Connection } from "@solana/web3.js"
import { IPortfolio } from "../../portfolio/portfolio"

// Rationally Distributed Example
// User deposits $100,000 into wallet
// The $100,000 is rationally distributed into sub accounts:
// Account Goal $500,000. Deposit: $50,000 / 50% ratio setting
// Account Goal $250,000. Deposit: $25,000 / 25% ratio setting
// Account Goal $200,000. Deposit: $20,000 / 20% ratio setting
// Account Goal $50,000. Deposit: $5,000 / 5% ratio setting

export const calculateShareRational = (portfolio: IPortfolio, amount: number, connection: Connection): bigint[] => {
  const total = portfolio.subaccounts.map(sa => sa.goal).reduce((prev, curr) => prev + curr, 0)
  const shares = portfolio.subaccounts.map(sa => BigInt(Math.floor(amount * sa.goal / total)))
  return shares
}
