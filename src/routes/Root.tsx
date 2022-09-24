import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
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
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';


type Props = {}

export const Root = (props: Props) => {
  const [value, setValue] = useState(0)
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const navigate = useNavigate()
  const mnemonic = useSelector(
    (state: RootState) => state.mnemonic
  )

  useEffect(() => {

    // - mnemonic is already set
    // navigate to "/portfolios"
    if (mnemonic.words.length == 12) {
      navigate("/portfolios")
    }

    // - no wallet mnemonic, 
    // navigate to mnemonic page to create a new mnemonic
    if (!localStorage.getItem("usdcwallet")) {
      navigate("/mnemonic")
    }

    // - localstorage has `usdcwallet`
    // - no mnemonic
    // navigate to `/password` to restore mnemonic
    if (localStorage.getItem("usdcwallet") && mnemonic.words.length == 0) {
      navigate("/password")
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