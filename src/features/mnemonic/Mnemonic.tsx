import { useDispatch } from "react-redux"
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { IMnemonic } from "./mnemonicSlice";
import { mnemonicSchema } from "./MnemonicSchema"
export const Mnemonic = () => {

  const dispatch = useDispatch();

  const {
    control,
    formState: { isValid, errors },
    getValues,
    handleSubmit
  } = useForm<IMnemonic>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(mnemonicSchema)
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "words"
  })
}