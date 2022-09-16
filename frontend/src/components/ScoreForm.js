import { useState } from "react";
import { usePerfContext } from "../hooks/usePerfContext";

// hooks
import { useUserContext } from "../hooks/useUserContext";

export default function ScoreForm({id}) {
  const { user } = useUserContext();
  const { dispatch } = usePerfContext();

  const [intScore, setIntScore] = useState("");
  const [diffScore, setDiffScore] = useState("");
  const [techScore, setTechScore] = useState("");

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const updatePerformance = async () => {
    const response = await fetch(`/api/performances/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify({intScore, diffScore, techScore})
    });
    const json = await response.json();

    if (!response.ok) {
      setIsPending(false);
      setError(json.errorMessage);
      setEmptyFields(json.emptyFields);
    } else {
      setIsPending(false);
      setError(null);
      setEmptyFields([]);

      dispatch({type: "SET_PERFORMANCE", payload: json});
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePerformance();
    console.log(emptyFields);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="int_score">Interpretation score:</label>
      <input 
        type="number" 
        id="int_score"
        onChange={(e) => setIntScore(e.target.value)}
        value={intScore}
        style={error && emptyFields.includes("intScore") ? {border: "1px solid crimson"} : {}}
      />
      <label htmlFor="diff_score">Difficulty score:</label>
      <input 
        type="number"
        id="diff_score"
        onChange={(e) => setDiffScore(e.target.value)}
        value={diffScore}
        style={error && emptyFields.includes("diffScore") ? {border: "1px solid crimson"} : {}}
      />
      <label htmlFor="tech_score">Technical score:</label>
      <input
        type="number"
        id="tech_score"
        onChange={(e) => setTechScore(e.target.value)}
        value={techScore}
        style={error && emptyFields.includes("techScore") ? {border: "1px solid crimson"} : {}}
      />
      <button disabled={isPending}>submit</button> 
      {error && <div className="error">{error}</div>}
    </form>
  )
};
