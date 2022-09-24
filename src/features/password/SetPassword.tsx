import { DevTool } from "@hookform/devtools"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Grid, TextField, Typography } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import CryptoJS from "crypto-js"
import { useConnection, useWallet } from '@solana/wallet-adapter-react';


import * as Yup from "yup"

interface IPassword {
  password1: string,
  password2: string,
}

export const SetPassword = () => {
  const {
    control,
    formState: { isValid, errors },
    handleSubmit,
    getValues
  } = useForm<IPassword>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(
      Yup.object().shape(
        {
          password1: Yup.string().required("required"),
          password2: Yup.string().required("required")
            .test("thesame",
              "Passwords doesn't match",
              validatePasswordsMatch
            )
        }
      )
    )
  })

  const { publicKey } = useWallet();

  function validatePasswordsMatch() : boolean{
    const { password1, password2 } = getValues()
    return password1 == password2
  }

  const navigate = useNavigate()
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h1">Password</Typography>
      </Grid>

      {/* Enter Password */}
      <Grid item xs={12} marginTop={10}>
        <Controller
          name={`password1`}
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <TextField
                fullWidth
                label={"Password"}
                type="password"
                {...field}
                error={errors?.password1?.message != undefined}
                helperText={errors?.password1?.message} />
            );
          }}
        />
      </Grid>

      {/* Enter Password */}
      <Grid item xs={12} marginTop={10}>
        <Controller
          name={`password2`}
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <TextField
                fullWidth
                label={"Re-enter Password"}
                type="password"
                {...field}
                error={errors?.password2?.message != undefined}
                helperText={errors?.password2?.message} />
            );
          }}
        />
      </Grid>

      {/* Create */}
      <Grid item xs={12} sx={{ paddingTop: 10 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={!isValid}
          onClick={
            handleSubmit(
              (passwords, e) => {
                // TODO: Sha & Encode the Mnemonic and store in the local storage
                var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
                if (publicKey) {
                  // localStorage.setItem(publicKey?.toBase58().toString(), encrypted.toString()); 
                  localStorage.setItem("usdcwallet", encrypted.toString()); 
                  navigate("/portfolios")
                }
              },
              (errors, e) => {
                console.log(errors)
              })
          }
        >
          Continue
        </Button>
      </Grid>
      <DevTool control={control} /> {/* set up the dev tool */}

    </Grid>
  )
}