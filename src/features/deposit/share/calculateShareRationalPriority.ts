import { getAssociatedTokenAddress } from "@solana/spl-token"
import { Connection, PublicKey } from "@solana/web3.js"
import { generateKeypair } from "../../../utils/solanaKeyGen"
import { IPortfolio } from "../../portfolio/portfolio"

// Additional Setting: Funds will not fill the next account until the prior account goal has reached 100% it's allocated goal amount.Also known as Priority Fill.
// User deposits $50,000 into wallet
// The $50,000 is rationally distributed into sub accounts:
// Account Goal: $37,500. Deposit: $37,500 / 75% of deposit - Account at 100% goal, move remaining balance to next.
// Account Goal: $10,000. Deposit: $10,000 / 20% of deposit - Account at 100% goal, move remaining balance to next.
// Account Goal: $10,000. Deposit: $2,500 / 5% of deposit - Account reached 5% of it's goal. The next deposit would pick up here, since accounts 1 & 2 are at 100% of there goals.
// Account Goal: $10,000. Deposit: $0 / 0% of deposit
// If all accounts reach % during a deposit, a new spill-over account will be created within the subaccount portfolio. In this case, Account 5, having no goal determined yet. Funds can be transferred back to main account to be distributed later.

export const calculateShareRationalPriority = async (portfolio: IPortfolio, amount: number, connection: Connection, mnemonic: string): Promise<number[]> => {
  const usdcMint = new PublicKey("GZboZw3r9kpLEsBrUBUxQX7cxdWLwMxSp9PLmwASmqf")

  const currentSaBalances = portfolio.subaccounts.map(async sa => {
    const saWallet = generateKeypair(mnemonic, { accountIndex: portfolio.index, subaccountIndex: sa.index })
    const saWalletAta = await getAssociatedTokenAddress(
      usdcMint,
      saWallet.publicKey
    )

    //
    // If subaccaunt `saWallet` has no balance,
    // add create ATA instruction
    //
    let saBalance: number = 0;
    try {
      const result = await connection.getTokenAccountBalance(saWalletAta)
      saBalance = result.value.uiAmount!
    } catch (error) {

    }
    return currentSaBalances
  })

  //
  // Distribute the amount to reach the goal
  //
  let remaining = amount;
  const shares: number[] = []
  for (let sai = 0; sai < portfolio.subaccounts.length; sai++) {
    const sa = portfolio.subaccounts[sai];
    const diff = sa.goal - currentSaBalances[sai];
    const goalReached = diff <= 0
    if (goalReached) {
      shares[sai] = 0
      continue
    }

    //
    // If there is remaining balance to fill the goal
    //
    if (diff <= remaining) {
      shares[sai] = diff
      remaining -= diff
    }
    else if (diff > remaining) {
      shares[sai] = remaining
      remaining = 0
    }
  }

  return shares
}
