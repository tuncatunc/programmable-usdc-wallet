import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { PorfolioDeposit as PD } from "../features/deposit/PorfolioDeposit";

export const PorfolioDeposit: React.FC = (): ReactElement => {
  const { accountIndex } = useParams()
  return (
    <PD ai={Number(accountIndex)}/>
  )
}
