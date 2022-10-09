import { Button, Grid, TextField, Typography } from "@mui/material";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { usdcMint } from "../../common/usdcMint";
import { generateKeypair } from "../../utils/solanaKeyGen";
import { useGetPortfoliosQuery } from "../api/apiSlice";
import { IPortfolio } from "../portfolio/portfolio";
import { withdraw } from "./withdrawFromPortfolio";

type WithdrawProps = {
  ai: number; // Account Index
  sai: number; // Subaccount Index
}

type WithdrawForm = {
  amount: number; // USDC amount
}

export const Withdraw = (props: WithdrawProps) => {
  const { ai, sai } = props;
  const { publicKey, sendTransaction } = useWallet();
  const navigate = useNavigate();

  const { connection } = useConnection()
  const {
    data: portfolios,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPortfoliosQuery(publicKey!.toBase58().toString())

  const portfolio: IPortfolio = portfolios[ai]
  const {
    control,
    formState: { isValid, errors },
    getValues,
    setValue,
    handleSubmit,
    reset
  } = useForm<WithdrawForm>(
    {
      mode: "onChange",
      reValidateMode: "onChange"
    }
  );

  const mnemonic = useSelector(
    (state: RootState) => state.mnemonic
  )

  const [saTokenBalance, setSaTokenBalance] = useState<number>(0)

  useEffect(() => {

    const getTokenBalance = async () => {
      var mnemonicStr = mnemonic.words.map(w => w.word).join(" ")
      const saWallet = generateKeypair(mnemonicStr, { accountIndex: ai, subaccountIndex: sai })
      const subaccountAta = await getAssociatedTokenAddress(
        usdcMint,
        saWallet.publicKey
      )

      // Get account USDC balance
      const tokenAccountInfo = await getAccount(connection, subaccountAta)
      setSaTokenBalance(Number(tokenAccountInfo.amount))
      console.log(tokenAccountInfo.amount)
    }

    getTokenBalance()
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h1" marginBottom={3}> Deposit USDC Into Portfolio</ Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body1" marginBottom={3}> Portfolio Account' USDC Balance is {saTokenBalance}</ Typography>
      </Grid>

      {/* Amount */}
      <Grid item xs={12}>
        <Controller
          name={`amount`}
          control={control}
          rules={{
            required: true,
            min: 1,
            max: saTokenBalance
          }}

          render={({ field }) => {
            return (
              <TextField
                type={"number"}
                fullWidth
                label={"Amount"}
                {...field}
                error={errors?.amount?.message != undefined}
                helperText={errors?.amount?.message} />
            );
          }}

        />
      </Grid>
      {/* Deposit Button */}
      <Grid item xs={12} sx={{ paddingTop: 20 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={!isValid}
          onClick={
            handleSubmit(
              async (data, e) => {
                console.log(`Deposit ${data.amount} into portfolio`)
                var mnemonicStr = mnemonic.words.map(w => w.word).join(" ")
                await withdraw(
                  connection,
                  publicKey!,
                  ai,
                  sai,
                  mnemonicStr,
                  data.amount)

                  navigate("/portfolios")
              },
              (errors, e) => {
                console.error(errors, e)
              })
          }
        >
          Withdraw USDC from  Subaccount
        </Button>
      </Grid>
    </Grid>

  )

}