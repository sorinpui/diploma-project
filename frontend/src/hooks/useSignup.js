import { useState } from "react";
import { useUserContext } from "./useUserContext";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const { dispatch } = useUserContext();
  const navigate = useNavigate();
  
  const signup = async (firstName, lastName, email, password, age, contestant) => {
    setIsPending(true);
    setError(null);
    setEmptyFields([]);

    const response = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({firstName, lastName, email, password, age, contestant})
    });

    const json = await response.json();

    if (!response.ok) {
      setIsPending(false);
      setError(json.errorMessage);
      setEmptyFields(json.emptyFields);
    } else {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));
    
      // update the User context
      dispatch({type: "LOGIN", payload: json});

      setIsPending(false);

      navigate("/home");
    }
  };

  return { signup, isPending, error, emptyFields };
}