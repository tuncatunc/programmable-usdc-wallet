import React, { FC, useCallback } from "react";
import IconButton from '@mui/material/IconButton';

import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount
} from "@solana/spl-token";
import { AccountBalance } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { generateKeypair } from '../../utils/solanaKeyGen';

interface DepositButtonProps {
  portfolioIdx: number
}

export const DepositButton = (props: DepositButtonProps) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const portfolios = useSelector(
    (state: RootState) => state.portfolios
  )
  const mnemonic = useSelector(
    (state: RootState) => state.mnemonic
  )

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    const { portfolioIdx } = props
    const porfolio = portfolios[portfolioIdx]
    const mnemonicStr = mnemonic.words.map(w => w.word).join(" ")
    const usdcMint = new PublicKey("GZboZw3r9kpLEsBrUBUxQX7cxdWLwMxSp9PLmwASmqf")
    const fromWallet = publicKey
    let tx = new Transaction();
    const fromWalletAta = await getAssociatedTokenAddress(
      usdcMint,
      fromWallet
    )

    console.log(`${fromWallet.toBase58()} USDC ata is ${fromWalletAta.toBase58()}`)

    // For each subaccount create a transfer transaction
    for (let sai = 0; sai < porfolio.subaccounts.length; sai++) {
      const toWallet = generateKeypair(mnemonicStr, { accountIndex: portfolioIdx, subaccountIndex: sai })
      const toWalletAta = await getAssociatedTokenAddress(
        usdcMint,
        toWallet.publicKey
      )

      let balance: number = 0
      try {
        const result = await connection.getTokenAccountBalance(toWalletAta);
        balance = result.value.uiAmount!
      } catch (error) {
        // console.error(error)
      }

      // Create associated token account
      if (!balance) { // 
        tx.add(
          createAssociatedTokenAccountInstruction(
            fromWallet,
            toWalletAta,
            toWallet.publicKey,
            usdcMint
          )
        )
      }

      tx.add(
        createTransferInstruction(
          fromWalletAta,
          toWalletAta,
          fromWallet,
          10,
          [],
          TOKEN_PROGRAM_ID
        )
      )
    }

    sendTransaction(
      tx, 
      connection,  
      { 
        preflightCommitment: "processed", 
        maxRetries: 5 
      }
    )

    // let blockhash = await (await connection.getLatestBlockhash('finalized')).blockhash;
    // tx.recentBlockhash = blockhash
    // tx.feePayer = fromWallet

    // const signature = await sendAndConfirmWithRetry(
    //   connection, 
    //   tx.serialize(), 
    //   {
    //     maxRetries: 5,
    //     skipPreflight: true
    //   },
    //   "processed");

  }, [publicKey, sendTransaction, connection]);

  return (
    <IconButton onClick={onClick} disabled={!publicKey}>
      <AccountBalance color='primary' />
      Fund the Portfolio
    </IconButton>
  );
};
