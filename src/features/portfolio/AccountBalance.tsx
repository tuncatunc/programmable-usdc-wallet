import { Box } from "@mui/material";
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

export interface AccountBalanceProps {
  accountIndex: number;
  subaccountIndex: number
}
export const AccountBalance = (props: AccountBalanceProps) => {
  const { accountIndex, subaccountIndex } = props
  const { connection } = useConnection()
  const portfolios = useSelector(
    (state: RootState) => state.portfolios
  )

  const mnemonic = useSelector(
    (state: RootState) => state.mnemonic
  )

  const [tokenBalance, setTokenBalance] = useState<BigInt>(BigInt(0))

  useEffect(() => {

    const getTokenBalance = async () => {
      const mnemonicStr = mnemonic.words.map(w => w.word).join(" ")
      const { publicKey } = generateKeypair(mnemonicStr, { accountIndex, subaccountIndex })
      const usdcMint = new PublicKey("GZboZw3r9kpLEsBrUBUxQX7cxdWLwMxSp9PLmwASmqf")
      
      const subaccountAta = await getAssociatedTokenAddress(
        usdcMint,
        publicKey
      )

      // Get account USDC balance
      const tokenAccountInfo = await getAccount(connection, subaccountAta)
      setTokenBalance(tokenAccountInfo.amount)
    }

    getTokenBalance()
  }, [])

  return (
    <Box>
      {tokenBalance.toString()} / {portfolios[accountIndex].subaccounts[subaccountIndex].goal}
    </Box>
  )
}