import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const NUM_OF_WORDS = 12;

export interface IMnemonic {
  words: string[];
}

const initialState: IMnemonic = {
  words: []
}

export const mnemonicSlice = createSlice({
  name: "hdwallet",
  initialState,
  reducers: {
    setMnemonic: (state, action: PayloadAction<IMnemonic>) => {
      state.words = action.payload.words;
    },
  }
})