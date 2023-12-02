import { Button, DialogTitle, TextField } from "@mui/material";
import { updateProfile } from "firebase/auth";
import { useState } from "react";

export default function EditName(props) {
  const [input, setInput] = useState(
    props.user.displayName === null ? "" : props.user.displayName
  );
  const handleSubmit = () => {
    updateProfile(props.user, {
      displayName: input,
    }).then(() => {
      props.setEdit(false);
      props.setMenu(false);
      props.updateUser();
    });
  };
  return (
    <div className="dialog">
      <DialogTitle>Type in your new user name:</DialogTitle>
      <TextField
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ marginBottom: "5px" }}
      />
      <Button variant="contained" onClick={() => handleSubmit()}>
        OK
      </Button>
    </div>
  );
}
