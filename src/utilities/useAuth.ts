import { useContext } from "react";
import { AuthContextProps } from "./interfaces";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = (): AuthContextProps => useContext(AuthContext);
