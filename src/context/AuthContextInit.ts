import { createContext } from "react";
import type { AuthContextType } from "./AuthContext";

// Export a separate context to satisfy react-refresh rule
const AuthReactContext = createContext<AuthContextType | undefined>(undefined);

export default AuthReactContext;

