import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PortfolioListIcon from '@mui/icons-material/FormatListNumbered';
import AddPortfolioIcon from '@mui/icons-material/AddCircleOutline';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { WalletMultiButton } from '@solana/wallet-adapter-material-ui';


type Props = {}

export const Root = (props: Props) => {
  const [value, setValue] = useState(0)
  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Portfolios"
            component={Link}
            to="/portfolios"
            icon={<PortfolioListIcon />} />
          <BottomNavigationAction
            label="New Portfolio"
            component={Link}
            to="/create-portfolio"
            icon={<AddPortfolioIcon />}
          />
          <BottomNavigationAction
            label="Wallet"
            component={() => <WalletMultiButton color={'info'} variant="text" />}
          />
        </BottomNavigation>
        <Outlet />
      </Container>
    </React.Fragment>
  )
}