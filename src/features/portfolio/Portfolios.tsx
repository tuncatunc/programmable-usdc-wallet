import { Box } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'

type Props = {}

export const Portfolios = (props: Props) => {
  const portfolios = useSelector(
    (state: RootState) => state.portfolios
  )
  return (
    <Box>

      <div>ShowPortfolio</div>
      {
        portfolios.map(p => (
          <Box>
            {JSON.stringify(p, null, 2)}
          </Box>
        ))
      }
    </Box>
  )
}