import React from "react";
import { ref as databaseRef, get } from "firebase/database";
import { database } from "../firebase";

const doesUsernameExist = async (username) => {
  const usersRef = databaseRef(database, "users");
  const snapshot = await get(usersRef);

  if (snapshot.exists()) {
    const users = snapshot.val();
    const usernames = Object.values(users).map((user) => user.username);

    if (usernames.includes(username)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export default doesUsernameExist;
