import React, { ReactElement, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Mnemonic } from "../../common/Mnemonic"

export const CreateWallet: React.FC = (): ReactElement => {
  return (
    <Mnemonic />
  )
}