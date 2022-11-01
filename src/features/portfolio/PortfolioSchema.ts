import * as Yup from "yup";

const ensureNumber = (val: number) => (isFinite(val) ? val : undefined);

export const portfolioSchema = Yup.object().shape({
  subaccounts: Yup.array()
    .of(
      Yup.object().shape({
        goal: Yup.number()
          .min(1, "min amount is $1")
          .required("Required")
          .transform(ensureNumber),
        name: Yup.string()
          .required("Name is required")
          .default("Account name")
      })
    ).min(1),
  name: Yup.string().required("Portfolio name is required")
});

export const rationalPortfolioSchema = Yup.object().shape({
  subaccounts: Yup.array()
    .of(
      Yup.object().shape({
        goal: Yup.number()
          .required("Required")
          .transform(ensureNumber),
        name: Yup.string()
          .required("Name is required")
          .default("Account name")
      })
    ).min(1),
  name: Yup.string().required("Portfolio name is required")
});
