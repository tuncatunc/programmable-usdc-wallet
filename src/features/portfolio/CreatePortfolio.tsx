import { MenuItem, Typography, Grid, Button, Select, TextField } from "@mui/material"
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useSelector, useDispatch } from "react-redux"
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { createPortfolio, CreatePortfolioActionType, PortfolioType, IPortfolio, Subaccount } from "./portfolioSlice"
import { portfolioSchema } from "./PortfolioSchema";
import { useState } from "react";

export const CreatePortfolio = () => {

  const {
    control,
    setValue,
    getValues,
    formState: { isValid }
  } = useForm<IPortfolio>(
    {
      mode: "onChange",
      reValidateMode: "onChange",
      resolver: yupResolver(portfolioSchema)
    }
  );
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "subaccounts", // unique name for your Field Array
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h2" marginBottom={3}>Create Portfolio</ Typography>
      </Grid>

      {/* Portfolio Type */}
      <Grid item xs={12}>
        <Controller
          name="type"
          control={control}
          defaultValue={PortfolioType.Even}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              fullWidth
              {...field}
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

      {/* Add new account */}
      <Grid item xs={12}>
        <IconButton
          color="primary"
          aria-label="add subaccount"
          onClick={
            () => {
              let sa: Subaccount = {
                goal: 0,
                index: 1
              }
              append(sa);
            }
          }
        >
          <AddIcon />
        </IconButton>
      </Grid>

      {
        fields.map((field, index) => (
          <>
            <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              {/* TODO: Create account address from derivation path */}
              <Jazzicon diameter={40} seed={jsNumberForAddress("0x2715d2B6667CA72EEE34C60d20cEdA1e7a277915")} />
            </Grid>
            <Grid item xs={8} sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
              <Controller
                key={field.id}
                {...{control, index, field}}
                name={`subaccounts.${index}.goal`}
                // name={`subaccounts.${index}.goal`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField fullWidth label={"Goal $USDC"} type="number" {...field}/>
                )}

              />
            </Grid>
            <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <IconButton
                color="primary"
                aria-label="remove subaccount"
                onClick={
                  () => {
                    remove(field.index)
                  }
                }
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
          </>
        ))
      }

      {/* Create */}
      <Grid item xs={12} sx={{ paddingTop: 20 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={!isValid}
        >
          Create Accounts
        </Button>
      </Grid>
      <DevTool control={control} /> {/* set up the dev tool */}

    </Grid>)
}