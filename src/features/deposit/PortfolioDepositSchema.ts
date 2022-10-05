import * as Yup from "yup";

export const portfolioDepositSchema =  Yup.object().shape({
  amount: Yup.number().min(0).max(10000)
});
