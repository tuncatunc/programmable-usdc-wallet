import { MenuItem, Typography, Grid, Button, Select, TextField } from "@mui/material"
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Jdenticon from 'react-jdenticon';

import { useDispatch } from "react-redux"
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { createPortfolio, PortfolioType, IPortfolio, Subaccount } from "./portfolioSlice"
import { portfolioSchema } from "./PortfolioSchema";
import { useNavigate } from "react-router-dom";

export const CreatePortfolio = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const {
    control,
    formState: { isValid, errors },
    getValues,
    handleSubmit
  } = useForm<IPortfolio>(
    {
      mode: "onChange",
      reValidateMode: "onChange",
      resolver: yupResolver(portfolioSchema)
    }
  );

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "subaccounts", // unique name for your Field Array
  });

  const { type } = getValues()

  return (

    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h1" marginBottom={3}>Create Portfolio</ Typography>
      </Grid>

      {/* Portfolio Name */}
      <Grid item xs={12}>
        <Controller
          name={`name`}
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <TextField
                fullWidth
                label={"Portfolio Name"}
                {...field}
                error={errors?.name?.message != undefined}
                helperText={errors?.name?.message} />
            );
          }}

        />
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
              label={"Portfolio Type"}
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
              const ni = getValues().subaccounts.length
              let sa: Subaccount = {
                goal: 10,
                index: ni
              }
              append(sa);
            }
          }
        >
          <AddIcon />
        </IconButton>
      </Grid>

      {
        fields.map((field, index) => {
          
          if (type == PortfolioType.Even)
          {
            return <>
              <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {/* TODO: Create account address from derivation path */}
                <Jdenticon size={40} seed={"0x2715d2B6667CA72EEE34C60d20cEdA1e7a277915"} />
              </Grid>
              <Grid item xs={8}>
                <Typography variant="caption">{`Account #${index}`}</Typography>
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
          }
          
          return (
            <>
              <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {/* TODO: Create account address from derivation path */}
                <Jdenticon size={40} seed={"0x2715d2B6667CA72EEE34C60d20cEdA1e7a277915"} />
              </Grid>
              <Grid item xs={8} sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
                <Controller
                  key={field.id}
                  {...{ control, index, field }}
                  name={`subaccounts.${index}.goal`}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <TextField
                        fullWidth
                        label={"Goal $USDC"}
                        type="number" {...field}
                        error={errors?.subaccounts && errors.subaccounts[index]?.goal?.message != undefined}
                        helperText={errors?.subaccounts && errors.subaccounts[index]?.goal?.message} />
                    );
                  }}

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
          )
        })
      }

      {/* Create */}
      <Grid item xs={12} sx={{ paddingTop: 20 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={type == PortfolioType.Even ? false : !isValid  }
          onClick={
            handleSubmit(
              (portfolio, e) => {
                dispatch(createPortfolio(portfolio))
                navigate("/portfolios")
              },
              (errors, e) => {
                console.error(errors, e)
              })
          }
        >
          Create Accounts
        </Button>
      </Grid>

    </Grid>)
}