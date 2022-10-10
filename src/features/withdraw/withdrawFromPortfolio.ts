import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, sendAndConfirmTransaction, PublicKey, clusterApiUrl, Transaction } from "@solana/web3.js";
import { decimals, usdcMint } from "../../common/usdcMint";
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
  let toAtaExists = false;
  try {
    const result = await connection.getTokenAccountBalance(saWalletAta)
    toAtaExists = true;
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
      BigInt(amount) * decimals) // Share for the subaccount 
    )
  )

  const txResult = await sendAndConfirmTransaction(connection, tx, [saWallet]);
  alert(`${amount} USDC is withdrawl to address ${to.toBase58()} is success!`)
}
