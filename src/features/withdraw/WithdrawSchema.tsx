import * as Yup from "yup";

export const withdrawSchema =  Yup.object().shape({
  amount: Yup.number().min(0).max(10000)
});
