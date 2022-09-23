import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PortfolioListIcon from '@mui/icons-material/FormatListNumbered';
import AddPortfolioIcon from '@mui/icons-material/AddCircleOutline';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { WalletMultiButton } from '@solana/wallet-adapter-material-ui';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';


type Props = {}

export const Root = (props: Props) => {
  const [value, setValue] = useState(0)
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    // TODO: If redux store has not wallet mnemonic, navigate to mnemonic page to create a new mnemonic
    // TODO: If localstorate has encrypted mnemonic, navigate to enter password to restore the mnemonic
    if (publicKey && localStorage.get(publicKey.toBase58().toString()))
    {
      // Return to enter password to restore MNEMONIC from local storage
    }
  }, [])
  if (!publicKey) {
    return (
      <WalletMultiButton color={'info'} variant="text" />
    )
  }

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