import { useDispatch } from "react-redux"
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { IMnemonic, mnemonicSlice, setWord } from "./mnemonicSlice";
import { mnemonicSchema } from "./MnemonicSchema"
import { useNavigate } from "react-router-dom";


export const Mnemonic = () => {

  const dispatch = useDispatch();

  const {
    control,
    formState: { isValid, errors },
    getValues,
    handleSubmit,
  } = useForm<IMnemonic>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(mnemonicSchema),
    defaultValues: {
      words: Array.from({ length: 12 }).map((word, index) => ({
        index,
        word: ""
      }))
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "words",
  })

  const navigate = useNavigate();


  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h1">Mnemonic</Typography>
      </Grid>

      {
        fields.map((field, index) => (
          <Grid item xs={4}>
            <Controller
              key={field.id}
              {...{ control, index, field }}
              name={`words.${index}.word`}
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <TextField
                    fullWidth
                    label={`Word ${index + 1}`}
                    type="text" {...field}
                    error={errors?.words && errors.words[index]?.word?.message != undefined}
                    helperText={errors?.words && errors.words[index]?.word?.message}
                  />
                );
              }}

            />
          </Grid>
        ))
      }

      {/* Create */}
      <Grid item xs={12} sx={{ paddingTop: 20 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={!isValid}
          onClick={
            handleSubmit(
              (mnemonic, e) => {

                for (let i = 0; i < mnemonic.words.length; i++) {
                  dispatch(
                    setWord(
                      {
                        index: mnemonic.words[i].index,
                        word: mnemonic.words[i].word
                      }
                    )
                  )
                }

                // Navigate to /set-password page
                navigate("/set-password")
              },
              (errors, e) => {
                console.log(errors)
              })
          }
        >
          Set 12 Word Mnemonic
        </Button>
      </Grid>

    </Grid>
  )
}