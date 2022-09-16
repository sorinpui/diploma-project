import { createContext, useReducer, useEffect } from "react";

export const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {...state, user: action.payload}
    case "LOGOUT":
      return {...state, user: null}
    case "AUTH_IS_READY":
      return {...state, authIsReady: true, user: action.payload}
    default:
      return state
  }
};

export const UserContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(userReducer, {
    user: null,
    authIsReady: false
  });
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    dispatch({type: "AUTH_IS_READY", payload: user});
  }, []);

  console.log("User context state:", state);

  return (
    <UserContext.Provider value={{...state, dispatch}}>
      {children}
    </UserContext.Provider>
  )
}