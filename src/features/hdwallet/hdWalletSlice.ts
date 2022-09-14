import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface HdWalletState {
  mnemonic: string[]
}

const initialState: HdWalletState = {
  mnemonic: ["", "", "", "", "", "", "", "", "", "", "", ""] // 12 Words
}

export interface MnemonicPayload {
  index: number,
  word: string
}

export const hdWalletSlice = createSlice({
  name: "hdwallet",
  initialState,
  reducers: {
    setWord: (state, action: PayloadAction<MnemonicPayload>) => {
      state.mnemonic[action.payload.index] = action.payload.word
    }
  }
})

export const { setWord } = hdWalletSlice.actions
export default hdWalletSlice.reducer