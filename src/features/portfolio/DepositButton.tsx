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
import { IPortfolio } from "./portfolio";
import { depositToPortfolio } from "./portfolioManager";

interface DepositButtonProps {
  portfolio: IPortfolio
}

export const DepositButton = (props: DepositButtonProps) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();

  const mnemonic = useSelector(
    (state: RootState) => state.mnemonic
  )

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();
    const mnemonicStr = mnemonic.words.map(w => w.word).join(" ")
    const portfolio = props.portfolio
    const amount = 1000; // TODO: Get it from UI

    const tx = await depositToPortfolio(
      connection,
      publicKey,
      portfolio,
      mnemonicStr,
      amount
    )


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
