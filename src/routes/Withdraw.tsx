
import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { Withdraw as WT } from "../features/withdraw/Withdraw";

export const Withdraw: React.FC = (): ReactElement => {
  const { accountIndex, subaccountIndex } = useParams()
  return (
    <WT ai={Number(accountIndex)} sai={Number(subaccountIndex)}/>
  )
}
