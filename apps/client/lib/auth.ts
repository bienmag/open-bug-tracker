import React, { useContext, useEffect } from "react";
import { setToken } from "./api";

export const authContext = React.createContext(null)

interface CurrentUser {
  setToken: (token: string) => void
  user: { id: number, name: string } | null
}

export function useUser(): CurrentUser {
  const user = useContext(authContext)
  console.log('this is the user', user)

  useEffect(() => {
    const mytoken = localStorage.getItem('token');
    if (mytoken) {
      setToken(mytoken);
      console.log('this is mytoken', mytoken)
    }
  })
  return {
    setToken: (mytoken) => {
      setToken(mytoken);
      localStorage.setItem('token', mytoken);
      console.log('this is token', mytoken)
    },
    user
  }
}