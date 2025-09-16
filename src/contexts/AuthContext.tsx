import { createContext } from "react";
import { AuthContextProps } from "../utilities/interfaces";

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
});
