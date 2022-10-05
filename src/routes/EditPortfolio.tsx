import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { RootState } from '../app/store'
import { CreatePortfolio as CP } from "../features/portfolio/CreatePortfolio"
type Props = {}

export const EditPortfolio = (props: Props) => {
  const navigate = useNavigate()
  const mnemonic = useSelector(
    (state: RootState) => state.mnemonic
  )
  let { accountIndex } = useParams()

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
      <CP ai={Number(accountIndex)} isEdit={true} />
    </div>
  )
}