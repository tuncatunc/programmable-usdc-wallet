import * as Yup from "yup";

export const withdrawSchema =  Yup.object().shape({
  amount: Yup.number().required("Enter an amount to withdraw!")
});
