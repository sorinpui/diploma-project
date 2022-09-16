import { useState } from "react";
import { useUserContext } from "./useUserContext";

export const useUpdateUser = (setUserData) => {
  const { user: authUser } = useUserContext();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [errorFields, setErrorFields] = useState([]);

  const updateUser = async (dataToUpdate) => {
    setErrorFields([]);
    setIsPending(true);
    setError(null);

    const response = await fetch("/api/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authUser.token}`
      },
      body: JSON.stringify(dataToUpdate)
    });

    const json = await response.json();

    setIsPending(false);
    
    if (!response.ok) {
      setError(json.error);
      setErrorFields(json.errorFields);
    } else {
      setError(null);
      setErrorFields([]);
      setUserData(json);
    }
  };

  return {updateUser, isPending, error, errorFields};
};