import * as Yup from "yup";

export const mnemonicSchema =  Yup.object().shape({
  words: Yup.array()
    .of(
      Yup.object().shape({
        goal: Yup.string()
          .required("required")
      })
    )
});
