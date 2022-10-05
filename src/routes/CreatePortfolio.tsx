import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../app/store'
import { CreatePortfolio as CP } from "../features/portfolio/CreatePortfolio"
type Props = {}

export const CreatePortfolio = (props: Props) => {
  const navigate = useNavigate()
  const mnemonic = useSelector(
    (state: RootState) => state.mnemonic
  )

  useEffect(() => {

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
    <div>
      <CP ai={Number(null)} isEdit={false}/>
    </div>
  )
}