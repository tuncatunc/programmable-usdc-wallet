import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const NUM_OF_WORDS = 12;

export interface IWord {
  word: string;
  index: number;
}

export type IMnemonic = {
  words: IWord[]
}

const initialState: IMnemonic = {
  words: []
}

export const mnemonicSlice = createSlice({
  name: "mnemonic",
  initialState,
  reducers: {
    setWord: (state, action: PayloadAction<IWord>) => {
      state.words[action.payload.index] = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const { setWord } = mnemonicSlice.actions

export default mnemonicSlice.reducer
