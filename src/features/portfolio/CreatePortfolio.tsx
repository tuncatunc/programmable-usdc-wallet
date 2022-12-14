import { MenuItem, Typography, Grid, Button, Select, TextField } from "@mui/material"
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Hashicon } from "@emeraldpay/hashicon-react"
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { PortfolioType, IPortfolio, Subaccount } from "./portfolio"
import { useCreatePortfolioMutation, useGetPortfoliosQuery, useUpdatePortfolioMutation } from '../api/apiSlice';

import { portfolioSchema, rationalPortfolioSchema } from "./PortfolioSchema";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { Fragment, useEffect } from "react";
import { DevTool } from "@hookform/devtools";

interface CreatePortfolioProps {
  isEdit: boolean; // In edit mode
  ai: number // Account index
}

export const CreatePortfolio = (props?: CreatePortfolioProps) => {

  const navigate = useNavigate()
  const { publicKey } = useWallet();
  const [createPortfolio, { isLoading: isCreating }] = useCreatePortfolioMutation()
  const [updatePortfolio, { isLoading: isUpdating }] = useUpdatePortfolioMutation()

  const {
    data: portfolios,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPortfoliosQuery(publicKey!.toBase58().toString())

  let resolver = yupResolver(portfolioSchema);

  if (portfolios.length &&
    portfolios[props!.ai].type == PortfolioType.Rational) {
    resolver = yupResolver(rationalPortfolioSchema)
  }

  const {
    control,
    formState: { isValid, errors },
    getValues,
    setValue,
    handleSubmit,
    reset
  } = useForm<IPortfolio>(
    {
      mode: "onChange",
      reValidateMode: "onChange",
      resolver: resolver,
    }
  );
  
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "subaccounts", // unique name for your Field Array
  });

  useEffect(() => {

    if (props?.isEdit) {
      const portfolio: IPortfolio = portfolios[props.ai]
      // Set the values from portfolio
      setValue("type", portfolio.type)
      setValue("name", portfolio.name)
      for (let sai = 0; sai < portfolio.subaccounts.length; sai++) {
        const sa = portfolio.subaccounts[sai];
        append(sa)
        setValue(`subaccounts.${sai}.index`, sa.index)
        setValue(`subaccounts.${sai}.goal`, sa.goal)
        setValue(`subaccounts.${sai}.name`, sa.name)
      }
      setValue("subaccounts", portfolio.subaccounts)
    }
  }, [portfolios])


  const { type } = getValues()

  return (

    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h1" marginBottom={3}>{props?.isEdit ? "Update" : "Create "}  Portfolio</ Typography>
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
                index: ni,
                name: `Account #${ni + 1}`
              }
              append(sa);
            }
          }
        >
          <AddIcon />
        </IconButton>
      </Grid>

      {/* Subaccounts */}
      {
        fields.map((field, index) => {

          if (type == PortfolioType.Even) {
            return <Fragment key={field.id}>
              <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} key={index}>
                {/* TODO: Create account address from derivation path */}
                <Hashicon size={40} value={"0x2715d2B6667CA72EEE34C60d20cEdA1e7a277915"} />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption">{`Account #${index + 1}`}</Typography>
              </Grid>
              <Grid item xs={4} sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
                <Controller
                  key={field.id}
                  {...{ control, index, field }}
                  name={`subaccounts.${index}.name`}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <TextField
                        fullWidth
                        label={"Name"}
                        type="text" {...field}
                        error={errors?.subaccounts && errors.subaccounts[index]?.name?.message != undefined}
                        helperText={errors?.subaccounts && errors.subaccounts[index]?.name?.message} />
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

            </ Fragment>
          }
          else if (type == PortfolioType.RationalPriority) {
            return (
              <Fragment key={field.id}>
                <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {/* TODO: Create account address from derivation path */}
                  <Hashicon size={40} value={"0x2715d2B6667CA72EEE34C60d20cEdA1e7a277915"} />
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
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
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
                  <Controller
                    key={field.id}
                    {...{ control, index, field }}
                    name={`subaccounts.${index}.name`}
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <TextField
                          fullWidth
                          label={"Name"}
                          type="text" {...field}
                          error={errors?.subaccounts && errors.subaccounts[index]?.name?.message != undefined}
                          helperText={errors?.subaccounts && errors.subaccounts[index]?.name?.message} />
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
              </ Fragment>
            )
          }
          else if (type == PortfolioType.Rational) {
            return (
              <Fragment key={field.id}>
                <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {/* TODO: Create account address from derivation path */}
                  <Hashicon size={40} value={"0x2715d2B6667CA72EEE34C60d20cEdA1e7a277915"} />
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
                  <Controller
                    key={field.id}
                    {...{ control, index, field }}
                    name={`subaccounts.${index}.goal`}
                    rules={{
                      required: true,
                      min: 0,
                      max: 100
                    }}

                    render={({ field }) => {
                      return (
                        <TextField
                          fullWidth
                          label={"Percentage"}
                          type="number" {...field}
                          onChange={async (e) => {
                            field.onChange(e)
                            // Validate sum if fields are 100
                          }}

                          error={errors?.subaccounts && errors.subaccounts[index]?.goal?.message != undefined}
                          helperText={errors?.subaccounts && errors.subaccounts[index]?.goal?.message} />
                      );
                    }}

                  />
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
                  <Controller
                    key={field.id}
                    {...{ control, index, field }}
                    name={`subaccounts.${index}.name`}
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <TextField
                          fullWidth
                          label={"Name"}
                          type="text" {...field}
                          error={errors?.subaccounts && errors.subaccounts[index]?.name?.message != undefined}
                          helperText={errors?.subaccounts && errors.subaccounts[index]?.name?.message} />
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
              </ Fragment>
            )
          }
        })
      }

      {/* Create */}
      <Grid item xs={12} sx={{ paddingTop: 20 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={!isValid}
          onClick={
            handleSubmit(
              (portfolio, e) => {
                if (props?.isEdit) {
                  portfolio.address = publicKey!.toBase58()
                  portfolio.index = props.ai; // Account index
                  updatePortfolio(portfolio)
                }
                else { // Create
                  portfolio.address = publicKey!.toBase58()
                  portfolio.index = portfolios.length;
                  createPortfolio(portfolio)

                }
                navigate("/portfolios")
              },
              (errors, e) => {
                console.error(errors, e)
              })
          }
        >
          {props?.isEdit ? "Update" : "Create "} Portfolio
        </Button>
      </Grid>
      <DevTool control={control} /> {/* set up the dev tool */}


    </Grid>)
}