import React, { useEffect, useState } from "react";
import AuthContext from "./auth-context";
import { ReactNode } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContextProvider=(props: AuthProviderProps)=>{
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // const [authError, setAuthError] = useState(null);



  useEffect(() => {
    const logInfo = localStorage.getItem("isLoggedIn")

    if (logInfo === "LOGGED_USER") {
      setIsLoggedIn(true);
    }
  }, [])

  const loginHandler = (username: string, password: string) => {
    // const users = [
    //   { email: "user@example.com", username: "johnny", password: "password123"},
    //   // ...other users
    // ];

    // const user = users.find((user) => user.email === email);

    // if (user && user.password === password) {
    //   localStorage.setItem("isLoggedIn", "LOGGED_USER");
    //   setIsLoggedIn(true);
    //   setAuthError(null); // Clear any previous authentication errors
    // } else {
    //   // If credentials don't match, set an error message
    //   setAuthError("Invalid email or password.");
    // }
    localStorage.setItem("isLoggedIn", "LOGGED_USER");
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };


  return (
    <>
      <AuthContext.Provider
        value={{
          isLoggedIn: isLoggedIn,
          onLogin: loginHandler,
          onLogOut: logoutHandler,
        }}
      >
        {props.children}
      </AuthContext.Provider>
    </>
  );
  
}

export default AuthContextProvider;