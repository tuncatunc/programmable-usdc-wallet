import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import { AccountBalance as BankIcon, Outbound as WithdrawIcon } from '@mui/icons-material';

import { IPortfolio, PortfolioType } from './portfolio';
import { AccountJazzIcon } from './AccountJazzicon';
import { IconButton } from '@mui/material';
import { AccountBalance } from './AccountBalance';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGetPortfoliosQuery } from '../api/apiSlice';
import { Link } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


function PortfolioRow(props: { portfolio: IPortfolio }) {
  const { portfolio } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <Link to={`/edit-portfolio/${portfolio.index}`}  >
            <EditIcon color='action' />
          </Link>
          {portfolio.name}
        </StyledTableCell>
        <StyledTableCell align="right">{portfolio.type}</StyledTableCell>
        <StyledTableCell align="right">{portfolio.subaccounts.length}</StyledTableCell>
        <StyledTableCell align="center">
          <Link to={`/deposit/${portfolio.index}`}>
            <IconButton >
              <BankIcon color='primary' sx={{ textDecoration: "none" }} />
              Deposit
            </IconButton>

          </Link>

        </StyledTableCell>

      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Subaccounts
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell>
                      {portfolio.type == PortfolioType.Even && "Target %"}
                      {portfolio.type == PortfolioType.Rational && "Target Ratio "}
                      {portfolio.type == PortfolioType.RationalPriority && "Target $USDC"}
                    </StyledTableCell>
                    <StyledTableCell>Balance $USDC</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {
                    portfolio.subaccounts.map((subaccount) => (
                      <StyledTableRow key={subaccount.index}>
                        <StyledTableCell component="th" scope="row">
                          <AccountJazzIcon accountIndex={portfolio.index} subaccountIndex={subaccount.index} />
                        </StyledTableCell>
                        <StyledTableCell>
                          {subaccount.goal}
                        </StyledTableCell>
                        <StyledTableCell>
                          <AccountBalance portfolio={portfolio} accountIndex={portfolio.index} subaccountIndex={subaccount.index} />
                        </StyledTableCell>
                        <StyledTableCell>
                          {subaccount.name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Link to={`/withdraw/${portfolio.index}/${subaccount.index}`}>
                            <IconButton >
                              <WithdrawIcon color='primary' sx={{ textDecoration: "none" }} />
                              Withdraw
                            </IconButton>

                          </Link>

                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
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
            <StyledTableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell>Portfolio Name</StyledTableCell>
              <StyledTableCell align="right">Type</StyledTableCell>
              <StyledTableCell align="right">#Subaccounts</StyledTableCell>
              <StyledTableCell />
            </StyledTableRow>
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