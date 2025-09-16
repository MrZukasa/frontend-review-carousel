import { useContext } from "react";
import { AuthContextProps } from "../interfaces";
import { AuthContext } from "./AuthContext";

export const useAuth = (): AuthContextProps => useContext(AuthContext);
