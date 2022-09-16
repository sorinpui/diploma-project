import { useUserContext } from "./useUserContext";

export const useLogout = () => {
  const { dispatch } = useUserContext();

  const logout = () => {
    // remove the user from storage
    localStorage.removeItem("user");

    // remove the user from the User Context
    dispatch({type: "LOGOUT"});
  }

  return { logout };
};