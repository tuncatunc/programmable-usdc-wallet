import { MapsHomeWork } from "@mui/icons-material";
import { createAssociatedTokenAccount, createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { generateKeypair } from "../../utils/solanaKeyGen";
import { calculateShareEven } from "./share/calculateShareEven";
import { IPortfolio, PortfolioType } from "../portfolio/portfolio";
import { calculateShare } from "./share";


// Creates transactions 
export const depositToPortfolio = async (
  connection: Connection,
  wallet: PublicKey,
  portfolio: IPortfolio,
  mnemonic: string,
  shares: number[]): Promise<Transaction> => {
  const usdcMint = new PublicKey("GZboZw3r9kpLEsBrUBUxQX7cxdWLwMxSp9PLmwASmqf")
  let tx = new Transaction();
  const walletAta = await getAssociatedTokenAddress(
    usdcMint,
    wallet
  )

  for (let sai = 0; sai < portfolio.subaccounts.length; sai++) {
    const sa = portfolio.subaccounts[sai];
    const saWallet = generateKeypair(mnemonic, { accountIndex: portfolio.index, subaccountIndex: sa.index })
    const saWalletAta = await getAssociatedTokenAddress(
      usdcMint,
      saWallet.publicKey
    )
  
    //
    // If subaccaunt `saWallet` has no balance,
    // add create ATA instruction
    //
    let saBalance: BigInt = BigInt(0);
    let decimals: number = 0
    try {
      const result = await connection.getTokenAccountBalance(saWalletAta)
      saBalance = BigInt(result.value.amount!) // subaccount balance
      decimals = result.value.decimals
    } catch (error) {
  
    }
  
    if (!saBalance) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          wallet,
          saWalletAta,
          saWallet.publicKey,
          usdcMint
        )
      )
    }
  
    //
    // Transfer share instruction
    //
    tx.add(
      createTransferInstruction(
        walletAta,
        saWalletAta,
        wallet,
        BigInt(shares[sai]) * BigInt(decimals), // Share for the subaccount 
        [],
        TOKEN_PROGRAM_ID
      )
    )
  }

  return tx;
}