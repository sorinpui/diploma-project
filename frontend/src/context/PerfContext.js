import { createContext, useReducer } from "react";

export const PerfContext = createContext();

const perfReducer = (state, action) => {
  switch (action.type) {
    case "SET_PERFORMANCE":
      return {...state, perf: action.payload}
    case "SET_COMMENTS":
      return {...state, comments: action.payload}
    case "POST_COMMENT":
      return {...state, comments: [action.payload, ...state.comments]}
    case "DELETE_COMMENT":
      return {...state, comments: state.comments.filter(comment => comment._id !== action.payload._id)}
    default:
      return state
  }
}

export const PerfContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(perfReducer, {
    perf: null,
    comments: [],
  })

  console.log("Performance context state:", state);
  
  return (
    <PerfContext.Provider value={{...state, dispatch}}>
      {children}
    </PerfContext.Provider>
  )
}