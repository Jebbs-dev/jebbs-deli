import React from "react";

type AuthType = {
  isLoggedIn: boolean,
  onLogin: (email: string, password: string) => void
  onLogOut: () => void
} 

const initialAuthContext: AuthType = {
  isLoggedIn: false,
  onLogin: (email, password) => {},
  onLogOut: () => {},
  // authError: null
};

const AuthContext = React.createContext<AuthType>(initialAuthContext);

export default AuthContext;