import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
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
import EditIcon from '@mui/icons-material/Edit';
import { AccountBalance as BankIcon, Outbound as WithdrawIcon } from '@mui/icons-material';
import OutputIcon from '@mui/icons-material/Output';

import { IPortfolio, PortfolioType } from './portfolio';
import { AccountJazzIcon } from './AccountJazzicon';
import { IconButton } from '@mui/material';
import { AccountBalance } from './AccountBalance';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGetPortfoliosQuery } from '../api/apiSlice';
import { Link } from 'react-router-dom';

function PortfolioRow(props: { portfolio: IPortfolio }) {
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
          <Link to={`/edit-portfolio/${portfolio.index}`}  >
            <EditIcon color='action' />
          </Link>
          {portfolio.name}
        </TableCell>
        <TableCell align="right">{portfolio.type}</TableCell>
        <TableCell align="right">{portfolio.subaccounts.length}</TableCell>
        <TableCell align="center">
          <Link to={`/deposit/${portfolio.index}`}>
            <IconButton >
              <BankIcon color='primary' sx={{ textDecoration: "none" }} />
              Deposit
            </IconButton>

          </Link>

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
                    <TableCell>
                      {portfolio.type == PortfolioType.Even && "Target %"}
                      {portfolio.type == PortfolioType.Rational && "Target Ratio "}
                      {portfolio.type == PortfolioType.RationalPriority && "Target $USDC"}
                    </TableCell>
                    <TableCell>Balance $USDC</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    portfolio.subaccounts.map((subaccount) => (
                      <TableRow key={subaccount.index}>
                        <TableCell component="th" scope="row">
                          <AccountJazzIcon accountIndex={portfolio.index} subaccountIndex={subaccount.index} />
                        </TableCell>
                        <TableCell>
                          {subaccount.goal}
                        </TableCell>
                        <TableCell>
                          <AccountBalance portfolio={portfolio} accountIndex={portfolio.index} subaccountIndex={subaccount.index} />
                        </TableCell>
                        <TableCell>
                          {subaccount.name}
                        </TableCell>
                        <TableCell align="center">
                          <Link to={`/withdraw/${portfolio.index}/${subaccount.index}`}>
                            <IconButton >
                              <WithdrawIcon color='primary' sx={{ textDecoration: "none" }} />
                              Withdraw
                            </IconButton>

                          </Link>

                        </TableCell>
                      </TableRow>
                    ))
                  }
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

  const { publicKey } = useWallet()

  const {
    data: portfolios,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPortfoliosQuery(publicKey!.toBase58().toString())

  if (isLoading || isError) {
    return <Box>Loading...</Box>
  }
  return (
    <>
      <Typography variant='h1'>
        Portfolios
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table" stickyHeader={true}>
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
            {
              portfolios.map((portfolio) => (
                <PortfolioRow key={portfolio.index} portfolio={portfolio} />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}