import { createContext } from "react";
import { AuthContextProps } from "../interfaces";

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
});
