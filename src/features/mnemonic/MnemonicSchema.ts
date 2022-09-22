import * as Yup from "yup";

export const mnemonicSchema =  Yup.object().shape({
  words: Yup.array()
    .of(
      Yup.object().shape({
        word: Yup.string().required("required")
      })
    )
});
