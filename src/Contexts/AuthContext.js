import React from "react";

const AuthContext = React.createContext();

export function AuthProvider() {
  return (
    <div>
      <AuthContext.Provider></AuthContext.Provider>
    </div>
  );
}
