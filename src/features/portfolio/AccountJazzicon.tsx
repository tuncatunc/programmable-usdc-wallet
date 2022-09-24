import { Button, Tooltip } from '@mui/material';
import Jdenticon from 'react-jdenticon';
import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { generateKeypair } from "../../utils/solanaKeyGen"

export interface AccountJazzIconProps {
  accountIndex: number;
  subaccountIndex: number
}

export const AccountJazzIcon = (props: AccountJazzIconProps) => {

  const { accountIndex, subaccountIndex } = props
  const portfolios = useSelector(
    (state: RootState) => state.portfolios
  )

  const mnemonic = useSelector(
    (state: RootState) => state.mnemonic
  )

  const mnemonicStr = mnemonic.words.map(w => w.word).join(" ")
  const { publicKey } = generateKeypair(mnemonicStr, { accountIndex, subaccountIndex })
  const publicKeyStr = publicKey.toBase58().toString()

  return (
    <Tooltip title={publicKeyStr} arrow> 
      <Button>
        <Jdenticon size={40} value={publicKeyStr} />
      </Button>
    </Tooltip>
  )
}