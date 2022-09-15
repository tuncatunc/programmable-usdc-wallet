import * as React from "react"
import { Typography, Stack, Grid, TextField } from "@mui/material"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Jazzicon from "react-jazzicon";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { PortfolioType, Subaccount } from "./portfolioSlice"
type Props = {}

export const CreatePortfolio = (props: Props) => {

  const MAX_NUM_SUBACCOUTS = 5;
  const [portfolioType, setPortfolioType] = React.useState<PortfolioType>(PortfolioType.Even);

  const [noSubaccounts, setNoSubaccounts] = React.useState<Number>(1)

  const [subaccounts, setSubaccounts] = React.useState<Subaccount[]>(
    Array.from({length: MAX_NUM_SUBACCOUTS}, (_, index) => ({index, goal: 0}))
  )

  const handlePortfolioTypeChange = (event: SelectChangeEvent) => {
    setPortfolioType(event.target.value as PortfolioType);
  };

  const handleSubaccountCountChange = (event: SelectChangeEvent) => {
    setNoSubaccounts(Number(event.target.value))
  }

  return (
    <Stack spacing={2} margin={2}>
      <Typography variant="h2" marginBottom={5}>Create Portfolio</ Typography>
      <Grid container spacing={1}>
        
        {/* Portfolio Type */}
        <Grid item xs={6}>
          <FormControl fullWidth>
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

        {/* Number of Subaccounts */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="no-subaccounts">Subaccounts Count</InputLabel>
            <Select
              labelId="no-subaccounts"
              id="no-subaccounts-select"
              value={String(noSubaccounts)}
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
          subaccounts.filter(sa => sa.index < noSubaccounts).map((sa, i) => (
            <Grid key={i} item xs={12}>
              <FormControl>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                <Jazzicon diameter={100} seed={Math.round(Math.random() * 10000000)} />
              </FormControl>
            </Grid>    
          ))
        }
      </Grid> {/* Grid Container */}
    </Stack>)
}