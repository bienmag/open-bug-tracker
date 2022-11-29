/** @format */

import React, { useContext, useEffect } from "react";
import { setToken } from "./api";

export const authContext = React.createContext(null);

interface CurrentUser {
  setToken: (token: string) => void;
  user: { id: number; name: string } | null;
}

export function UseUser(): CurrentUser {
  const user = useContext(authContext);
  useEffect(() => {
    const mytoken = localStorage.getItem("token");
    if (mytoken) {
      setToken(mytoken);
    }
  });
  return {
    setToken: (mytoken) => {
      setToken(mytoken);
      localStorage.setItem("token", mytoken);
    },
    user,
  };
}
