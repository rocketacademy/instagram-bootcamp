import { Avatar, Button, Dialog, Menu, MenuItem } from "@mui/material";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";
import EditName from "./EditName";

export default function UserMenu(props) {
  const [menu, setMenu] = useState(null);
  const [edit, setEdit] = useState(false);
  return (
    <div>
      <Button
        onClick={(e) => {
          setMenu(e.target);
        }}
      >
        <Avatar>
          {props.user.displayName
            ? props.user.displayName[0]
            : props.user.email[0]}
        </Avatar>
      </Button>
      <Menu anchorEl={menu} open={Boolean(menu)} onClose={() => setMenu(null)}>
        <MenuItem
          onClick={() => {
            signOut(auth);
          }}
        >
          Log out
        </MenuItem>
        <MenuItem
          onClick={() => {
            setEdit(true);
          }}
        >
          Edit user name
        </MenuItem>
      </Menu>
      <Dialog open={edit} onClose={() => setEdit(false)}>
        <EditName
          user={props.user}
          setEdit={setEdit}
          setMenu={setMenu}
          updateUser={props.updateUser}
        />
      </Dialog>
    </div>
  );
}
