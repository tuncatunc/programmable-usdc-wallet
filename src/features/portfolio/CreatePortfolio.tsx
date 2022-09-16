import * as React from "react"
import { Typography, Stack, Grid, TextField, Button, Box } from "@mui/material"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { createPortfolio, CreatePortfolioActionType, PortfolioType, Subaccount } from "./portfolioSlice"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from '../../app/store'


export const CreatePortfolio = () => {

  const MAX_NUM_SUBACCOUTS = 5;
  const [portfolioType, setPortfolioType] = React.useState<PortfolioType>(PortfolioType.Even);

  const [noAccounts, setNoSubaccounts] = React.useState<number>(1)

  const [subaccounts, setSubaccounts] = React.useState<Subaccount[]>(
    Array.from({ length: MAX_NUM_SUBACCOUTS }, (_, index) => ({ index, goal: 0 }))
  )

  const handlePortfolioTypeChange = (event: SelectChangeEvent) => {
    setPortfolioType(event.target.value as PortfolioType);
  };

  const handleSubaccountCountChange = (event: SelectChangeEvent) => {
    setNoSubaccounts(Number(event.target.value))
  }

  const portfolio = useSelector((state: RootState) => state.portfolio)
  const dispatch = useDispatch()

  return (
    <Grid container spacing={2} margin={2}>
      <Grid item xs={12}>
        <Typography variant="h2" marginBottom={3}>Create Portfolio</ Typography>
      </Grid>

      {/* Portfolio Type */}
      <Grid item xs={12}>
        <FormControl sx={{ width: "80%" }}>
          <InputLabel id="portfolio-type">Portfolio Type</InputLabel>
          <Select
            labelId="portfolio-type"
            id="portfolio-type-select"
            value={portfolioType}
            label="Portfolio Type"
            onChange={handlePortfolioTypeChange}
          >
            <MenuItem value={PortfolioType.Even}>{PortfolioType.Even}</MenuItem>
            <MenuItem value={PortfolioType.Rational}>{PortfolioType.Rational}</MenuItem>
            <MenuItem value={PortfolioType.RationalPriority}>{PortfolioType.RationalPriority}</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4" marginBottom={2}>Accounts</ Typography>
      </Grid>

      {/* Number of Accounts */}
      <Grid item xs={12}>
        <FormControl sx={{ width: "80%" }}>
          <InputLabel id="no-subaccounts">Number of Accounts</InputLabel>
          <Select
            labelId="no-subaccounts"
            id="no-subaccounts-select"
            value={String(noAccounts)}
            label="No of Subaccounts"
            onChange={handleSubaccountCountChange}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Accounts */}
      {
        subaccounts.filter(sa => sa.index < noAccounts).map((sa, i) => (
          <>
            <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              {/* TODO: Create account address from derivation path */}
              <Jazzicon diameter={40} seed={jsNumberForAddress("0x2715d2B6667CA72EEE34C60d20cEdA1e7a277915")} />
            </Grid>
            <Grid item xs={10} sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
              <FormControl>
                <TextField
                  type="number"
                  variant="outlined"
                  label={`#${sa.index + 1} Goal $USDC`}
                />
              </FormControl>
            </Grid>
          </>
        ))
      }

      {/* Create */}
      <Grid item xs={12} sx={{ paddingTop: 20 }}>
        <Button
          sx={{ width: "80%" }}
          variant="contained"
          onClick={() => {
            const action: CreatePortfolioActionType = {
              noAccounts: noAccounts,
              type: portfolioType,
              goals: subaccounts.map(sa => sa.goal)
            }
            dispatch(createPortfolio(action))
          }}
        >
          Create {`${noAccounts}`} Accounts
        </Button>
      </Grid>
    </Grid>)
}