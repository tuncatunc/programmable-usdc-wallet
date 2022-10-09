import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, sendAndConfirmTransaction, PublicKey, clusterApiUrl, Transaction } from "@solana/web3.js";
import { generateKeypair } from "../../utils/solanaKeyGen";

export const withdraw = async (
  walletConnection: Connection,
  to: PublicKey,
  ai: number,
  sai: number,
  mnemonic: string,
  amount: number) => {

  const connection = new Connection(
    clusterApiUrl("devnet"),
    "confirmed"
  );

  const usdcMint = new PublicKey("GZboZw3r9kpLEsBrUBUxQX7cxdWLwMxSp9PLmwASmqf")
  let tx = new Transaction();
  const toAta = await getAssociatedTokenAddress(
    usdcMint,
    to
  )

  const saWallet = generateKeypair(mnemonic, { accountIndex: ai, subaccountIndex: sai })
  const saWalletAta = await getAssociatedTokenAddress(
    usdcMint,
    saWallet.publicKey
  )
  //
  // If subaccaunt `saWallet` has no balance,
  // add create ATA instruction
  //
  let toTokenBalance: BigInt = BigInt(0);
  let toAtaExists = false;
  let decimals: number = 6
  try {
    const result = await connection.getTokenAccountBalance(saWalletAta)
    toAtaExists = true;
    toTokenBalance = BigInt(result.value.amount!) // subaccount balance
  } catch (error) {

  }

  if (!toAtaExists) {
    tx.add(
      createAssociatedTokenAccountInstruction(
        saWallet.publicKey,
        toAta,
        to,
        usdcMint
      )
    )
  }

  //
  // Transfer share instruction
  //
  tx.add(
    createTransferInstruction(
      saWalletAta,
      toAta,
      saWallet.publicKey,
      // shares[sai],
      BigInt(amount) * BigInt(decimals), // Share for the subaccount 

    )
  )

  const txResult = await sendAndConfirmTransaction(connection, tx, [saWallet]);
  alert(`${amount} USDC is withdrawl to address ${to.toBase58()} is success!`)
}
