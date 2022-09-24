import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../app/store'
import { Portfolios as AllPortfolios } from "../features/portfolio/Portfolios"
type Props = {}

export const Portfolios = (props: Props) => {
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


  return (
    <AllPortfolios />
  )
}