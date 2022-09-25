import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { useSelector } from 'react-redux'
import { IPortfolio, PortfolioType } from './portfolioSlice';
import { RootState } from '../../app/store'
import { AccountJazzIcon } from './AccountJazzicon';
import { Button } from '@mui/material';

function Row(props: { portfolio: IPortfolio }) {
  const { portfolio } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {portfolio.name}
        </TableCell>
        <TableCell align="right">{portfolio.type}</TableCell>
        <TableCell align="right">{portfolio.subaccounts.length}</TableCell>
        <TableCell align="center">
          <Button>Deposit</Button>
        </TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Subaccounts
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Goal $USDC</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {portfolio.subaccounts.map((subaccount) => (
                    <TableRow key={subaccount.index}>
                      <TableCell component="th" scope="row">
                        {/* TODO: Create account address from derivation path */}
                        {/* <Jazzicon diameter={40} seed={jsNumberForAddress("0x2715d2B6667CA72EEE34C60d20cEdA1e7a277915")} /> */}
                        <AccountJazzIcon accountIndex={portfolio.index} subaccountIndex={subaccount.index} />

                      </TableCell>
                      <TableCell>
                        {
                        portfolio.type != PortfolioType.Even ? subaccount.goal : "N/A"
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export const Portfolios = () => {
  const portfolios = useSelector(
    (state: RootState) => state.portfolios
  )
  return (
    <>
      <Typography variant='h1'>
        Portfolios
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Portfolio Name</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">#Subaccounts</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolios.map((portfolio) => (
              <Row key={portfolio.index} portfolio={portfolio} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}