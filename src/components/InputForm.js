import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Stack } from "@mui/material";
import { Send } from "@mui/icons-material";

export default function InputForm(props) {
  return (
    <>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "50%" },
          display: "flex",
          flexDirection: "row",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-multiline-static"
          label="message"
          multiline
          type="text"
          onChange={(e) => props.setInputText(e.target.value)}
          value={props.inputText}
        />

        <TextField
          id="outlined-basic"
          type="file"
          // value={props.fileValue}
          onChange={(e) => props.setImage(e.target.files[0])}
          variant="outlined"
        />
      </Box>
      <Stack>
        <Button onClick={props.writeData} variant="contained">
          <Send />
        </Button>
      </Stack>
    </>
  );
}
