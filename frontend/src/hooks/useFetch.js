import { useEffect, useState } from "react";
import { usePerfContext } from "./usePerfContext";

export const useFetch = (url, method="GET") => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(null);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [options, setOptions] = useState(null);
  
  const { dispatch } = usePerfContext();

  const postData = (postData) => {
    setOptions({
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    })
  }

  const patchData = (patchData) => {
    setOptions({
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patchData)
    })
  }

  useEffect(() => {
    const fetchData = async (options) => {
      setEmptyFields([]);
      setIsPending(true);
      setError(false);

      const response = await fetch(url, {...options});
      const json = await response.json();
      
      if (!response.ok) {
        setIsPending(false);
        setError(json.errorMessage);

        if (method === "POST" || method === "PATCH") {
          setEmptyFields(json.emptyFields);
        }
      } else {
        setData(json);

        if (!Array.isArray(json) && json.period) {
          dispatch({type: "SET_PERFORMANCE", payload: json});
        }

        setIsPending(false);
        setError(false);
      }
    }

    if (method === "GET") {
      fetchData();
    }

    if (method === "POST" && options) {
      fetchData(options);
    }

    if (method === "PATCH" && options) {
      fetchData(options);
    }

  }, [url, method, options]);

  return {data, isPending, error, emptyFields, postData, patchData};
}