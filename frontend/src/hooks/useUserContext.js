import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useAuthContext cannot be used outside of AuthContextProvider");
  }

  return context;
}