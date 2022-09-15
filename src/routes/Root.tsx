import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PortfolioListIcon from '@mui/icons-material/FormatListNumbered';
import AddPortfolioIcon from '@mui/icons-material/AddCircleOutline';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';


type Props = {}

export const Root = (props: Props) => {
  const [value, setValue] = useState(0)
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
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
        </BottomNavigation>
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', margin: '10px' }}>
          <Outlet />
        </Box>
      </Container>
    </React.Fragment>
  )
}