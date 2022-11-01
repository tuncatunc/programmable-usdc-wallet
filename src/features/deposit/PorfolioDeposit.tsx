import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, sendAndConfirmTransaction } from "@solana/web3.js"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { RootState } from "../../app/store"
import { decimals, usdcMint } from "../../common/usdcMint"
import { generateKeypair } from "../../utils/solanaKeyGen"
import { useGetPortfoliosQuery } from "../api/apiSlice"
import { AccountBalance } from "../portfolio/AccountBalance"
import { AccountJazzIcon } from "../portfolio/AccountJazzicon"
import { IPortfolio, PortfolioType } from "../portfolio/portfolio"
import { depositToPortfolio } from "./portfolioManager"
import { calculateShare } from "./share"


type DeposiftForm = {
  amount: number
}

type PortfolioDepositProps = {
  ai: number; // Account Index
}

//
// Deposit amount into porfolio
//
export const PorfolioDeposit = (props: PortfolioDepositProps) => {
  const { ai } = props
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection()
  const navigate = useNavigate();

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
  } = useForm<DeposiftForm>(
    {
      mode: "onChange",
      reValidateMode: "onChange"
    }
  );
  const mnemonic = useSelector(
    (state: RootState) => state.mnemonic
  )
  const [walletTokenBalance, setWalletTokenBalance] = useState<bigint>(0n)

  useEffect(() => {

    const getTokenBalance = async () => {

      const subaccountAta = await getAssociatedTokenAddress(
        usdcMint,
        publicKey!
      )

      // Get account USDC balance
      const tokenAccountInfo = await getAccount(connection, subaccountAta)
      setWalletTokenBalance(tokenAccountInfo.amount / 1000000n)
      console.log(tokenAccountInfo.amount)
    }

    getTokenBalance()
  }, [])


  const [shares, setShares] = useState<bigint[]>([])
  const isSharesGreaterThanZero = shares.reduce((p, c) => p + c, 0n) > 0n
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h1" marginBottom={3}> Deposit USDC Into Portfolio</ Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body1" marginBottom={3}>
          {`Wallet's USDC Balance is ${walletTokenBalance}`}
        </ Typography>
      </Grid>

      {/* Amount */}
      <Grid item xs={12}>
        <Controller
          name={`amount`}
          control={control}
          rules={{
            required: true,
            min: 0,
            max: Number(walletTokenBalance)
          }}

          render={({ field }) => {
            return (
              <TextField
                type={"number"}
                fullWidth
                label={"Amount"}
                {...field}
                onChange={async (e) => {
                  field.onChange(e)
                  var mnemonicStr = mnemonic.words.map(w => w.word).join(" ")
                  const s = await calculateShare(portfolio, Number(getValues().amount), connection, mnemonicStr)
                  setShares(s)
                }}
                error={errors?.amount?.message != undefined}
                helperText={errors?.amount?.message} />
            );
          }}

        />
      </Grid>

      {/* Shares Preview */}
      {portfolio &&
        <Grid item xs={12}>
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Share $USDC</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                portfolio.subaccounts.map((subaccount, sai) => { // si: share index
                  const share = shares[sai]
                  let sbstr: string = ""
                  if (share) { 
                    sbstr = share.toString()
                  }
                  return (
                    <TableRow key={sai}>
                      <TableCell component="th" scope="row">
                        <AccountJazzIcon accountIndex={ai} subaccountIndex={sai} />
                      </TableCell>
                      <TableCell>
                        {sbstr}
                      </TableCell>
                      <TableCell>
                        <AccountBalance accountIndex={ai} portfolio={portfolio} subaccountIndex={sai} />
                      </TableCell>
                      <TableCell>
                        {subaccount.name}
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </Grid>
      }
      {/* Deposit Button */}
      <Grid item xs={12} sx={{ paddingTop: 20 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={!isValid || !isSharesGreaterThanZero}
          onClick={
            handleSubmit(
              async (data, e) => {
                console.log(`Deposit ${data.amount} into portfolio`)
                var mnemonicStr = mnemonic.words.map(w => w.word).join(" ")
                const tx = await depositToPortfolio(connection, publicKey!, portfolio, mnemonicStr, shares)
                await sendTransaction(
                  tx,
                  connection,
                  {
                    preflightCommitment: "processed",
                    maxRetries: 5
                  }
                )
                alert(`${data.amount} USDC transfer is submitted!`)
                navigate("/portfolios")
              },
              (errors, e) => {
                console.error(errors, e)
              })
          }
        >
          Deposit USDC Into Portfolio
        </Button>
      </Grid>
    </Grid>

  )
}