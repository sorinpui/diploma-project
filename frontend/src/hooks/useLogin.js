import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/useUserContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const { dispatch } = useUserContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsPending(true);
    setError(false);

    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email, password})
    });

    const json = await response.json();

    if (!response.ok) {
      setIsPending(false);
      setError(json.errorMessage);
      setEmptyFields(json.emptyFields);
    } else {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));
    
      // update the Auth context
      dispatch({type: "LOGIN", payload: json});
      
      setIsPending(false);

      navigate("/home");
    }
  };

  return { login, isPending, error, emptyFields };
}