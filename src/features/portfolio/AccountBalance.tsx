import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import {
  TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress
} from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { RootState } from "../../app/store";
import { generateKeypair } from "../../utils/solanaKeyGen";
import { PublicKey } from "@solana/web3.js";
import { useGetPortfoliosQuery } from "../api/apiSlice";
import { IPortfolio, PortfolioType } from "./portfolio";
import { decimals, usdcMint } from "../../common/usdcMint";

export interface AccountBalanceProps {
  portfolio: IPortfolio;
  accountIndex: number;
  subaccountIndex: number;
}

export const AccountBalance = (props: AccountBalanceProps) => {
  const { accountIndex, subaccountIndex, portfolio } = props
  const { connection } = useConnection()


  const mnemonic = useSelector(
    (state: RootState) => state.mnemonic
  )

  const [tokenBalance, setTokenBalance] = useState<bigint>(0n)

  useEffect(() => {

    const getTokenBalance = async () => {
      const mnemonicStr = mnemonic.words.map(w => w.word).join(" ")
      const { publicKey } = generateKeypair(mnemonicStr, { accountIndex, subaccountIndex })
      
      const subaccountAta = await getAssociatedTokenAddress(
        usdcMint,
        publicKey
      )

      // Get account USDC balance
      const tokenAccountInfo = await getAccount(connection, subaccountAta)
      setTokenBalance(tokenAccountInfo.amount / 1000000n) // USDC is 6 decimals
    }

    getTokenBalance()
  }, [])

  return (
    <Typography variant="body1">
      {tokenBalance.toString()} 
      {portfolio.type != PortfolioType.Even && "/"}
      {portfolio.type != PortfolioType.Even && portfolio.subaccounts[subaccountIndex].goal} USDC
    </Typography>
  )
}