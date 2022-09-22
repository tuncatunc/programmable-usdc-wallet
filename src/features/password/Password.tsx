import { DevTool } from "@hookform/devtools"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Grid, TextField, Typography } from "@mui/material"
import { Controller, useForm } from "react-hook-form"

import * as Yup from "yup"

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
              (password, e) => {
                //dispatch(createPortfolio(portfolio))
                console.log(password)
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