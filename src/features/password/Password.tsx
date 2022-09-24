import { DevTool } from "@hookform/devtools"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Grid, TextField, Typography } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import * as Yup from "yup"
import CryptoJS from "crypto-js"
import { setWord } from "../mnemonic/mnemonicSlice";
import { useNavigate } from "react-router-dom"

interface IPassword {
  password: string
}

export const Password = () => {
  const {
    control,
    formState: { isValid, errors },
    handleSubmit
  } = useForm<IPassword>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(Yup.object().shape({ password: Yup.string().required("required") }))
  })

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h1">Password</Typography>
      </Grid>

      {/* Portfolio Name */}
      <Grid item xs={12} marginTop={10}>
        <Controller
          name={`password`}
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <TextField
                fullWidth
                label={"Password"}
                type="password"
                {...field}
                error={errors?.password?.message != undefined}
                helperText={errors?.password?.message} />
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
              ({password}, e) => {
                // Decrypt the mnemonic and dispatch set word
                const encrypted = localStorage.getItem("usdcwallet")
                if (encrypted) {
                  const decrypted = CryptoJS.AES.decrypt(encrypted, password)
                  const words = decrypted.toString(CryptoJS.enc.Utf8).split(" ")
                  for (let index = 0; index < words.length; index++) {
                    dispatch(
                      setWord(
                        {
                          index: index,
                          word: words[index]
                        }
                      )
                    )
                  }
                  navigate("/portfolios")

                }
                
              },
              (errors, e) => {
                console.log(errors)
              }
            )
          }
        >
          Continue
        </Button>
      </Grid>

    </Grid>
  )
}