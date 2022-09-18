import * as Yup from "yup";

const ensureNumber = (val: number) => (isFinite(val) ? val : undefined);

export const portfolioSchema =  Yup.object().shape({
  subaccounts: Yup.array()
    .of(
      Yup.object().shape({
        goal: Yup.number()
          .required("Goal is required")
          .transform(ensureNumber)
      })
    )
});
