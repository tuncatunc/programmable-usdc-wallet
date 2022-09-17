import * as React from "react"
import { Typography, Grid, Button, Input, TextField } from "@mui/material"

import MenuItem from '@mui/material/MenuItem';
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useSelector, useDispatch } from "react-redux"
import { useForm, Controller } from "react-hook-form";

import { createPortfolio, CreatePortfolioActionType, PortfolioType, IPortfolio } from "./portfolioSlice"
import type { RootState } from '../../app/store'


export const CreatePortfolio = () => {

  const MAX_NUM_SUBACCOUTS = 5;

  const { handleSubmit, reset, setValue, control, watch, register } = useForm<IPortfolio>();

  const portfolio = useSelector((state: RootState) => state.portfolio)
  const dispatch = useDispatch()
  const noSubaccounts = watch("noSubaccounts")

  return (
    <Grid container spacing={2} margin={2}>
      <Grid item xs={12}>
        <Typography variant="h2" marginBottom={3}>Create Portfolio</ Typography>
      </Grid>

      {/* Portfolio Type */}
      <Grid item xs={12}>
        <Controller
          name="type"
          control={control}
          defaultValue={PortfolioType.Even}
          render={({ field }) => (
            <Select {...field}
            >
              <MenuItem value={PortfolioType.Even}>{PortfolioType.Even}</MenuItem>
              <MenuItem value={PortfolioType.Rational}>{PortfolioType.Rational}</MenuItem>
              <MenuItem value={PortfolioType.RationalPriority}>{PortfolioType.RationalPriority}</MenuItem>
            </Select>
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4" marginBottom={2}>Accounts</ Typography>
      </Grid>

      {/* Number of Accounts */}
      <Grid item xs={12}>
        <Controller
          name="noSubaccounts"
          control={control}
          defaultValue={2}
          render={({ field }) => (
            <Select {...field}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>

          )}
        />
      </Grid>
      {
        Array.from({ length: noSubaccounts }).map((_, i) => (
          <>
            <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              {/* TODO: Create account address from derivation path */}
              <Jazzicon diameter={40} seed={jsNumberForAddress("0x2715d2B6667CA72EEE34C60d20cEdA1e7a277915")} />
            </Grid>
            <Grid item xs={10} sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
              <Controller
                name={`subaccounts.${i}.goal`}
                // name={`subaccounts.${index}.goal`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField onChange={onChange} value={value} label={"Text Value"} />
                )}
        
              />

            </Grid>
          </>
        ))
      }

      {/* Create */}
      <Grid item xs={12} sx={{ paddingTop: 20 }}>
        <Button
          sx={{ width: "80%" }}
          variant="contained"
        >
          Create Accounts
        </Button>
      </Grid>
    </Grid>)
}