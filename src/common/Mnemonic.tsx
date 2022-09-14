import React, { ReactElement, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Mnemonic = {
  word1: string;
  word2: string;
  word3: string;
  word4: string;
  word5: string;
  word6: string;
  word7: string;
  word8: string;
  word9: string;
  word10: string;
  word11: string;
  word12: string;
};

export const Mnemonic: React.FC = (): ReactElement => {
  const { register, handleSubmit } = useForm<Mnemonic>()
  const onSubmit: SubmitHandler<Mnemonic> = data => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-4 gap-4">
        <input key={"word1"} {...register("word1", { required: true })} type="text" />
        <input key={"word2"} {...register("word2", { required: true })} type="text" />
        <input key={"word3"} {...register("word3", { required: true })} type="text" />
        <input key={"word4"} {...register("word4", { required: true })} type="text" />
        <input key={"word5"} {...register("word5", { required: true })} type="text" />
        <input key={"word6"} {...register("word6", { required: true })} type="text" />
        <input key={"word7"} {...register("word7", { required: true })} type="text" />
        <input key={"word8"} {...register("word8", { required: true })} type="text" />
        <input key={"word9"} {...register("word9", { required: true })} type="text" />
        <input key={"word10"} {...register("word10", { required: true })} type="text" />
        <input key={"word11"} {...register("word11", { required: true })} type="text" />
        <input key={"word12"} {...register("word12", { required: true })} type="text" />
        <input key={"submit"} type="submit" />
      </div>
    </form>
  )
}