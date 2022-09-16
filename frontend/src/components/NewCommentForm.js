import { useState } from "react";
import { useUserContext } from "../hooks/useUserContext";
import { usePerfContext } from "../hooks/usePerfContext";

export default function CommentForm({performance_id}) {
  const { user } = useUserContext();
  const { dispatch } = usePerfContext();

  const [text, setText] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const postComment = async () => {
    setIsPending(true);
    setError(null);

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify({performance_id, text})
    })

    const json = await response.json();

    if (!response.ok) {
      setIsPending(false);
      setError(json.errorMessage);
    } else {
      // dispatch action to comments list context in the future
      setIsPending(false);
      setError(null);
      
      dispatch({type: "POST_COMMENT", payload: json});
      setText("");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postComment();
    console.log(user._id, text);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="comment">Enter your comment:</label>
      <textarea
        id="comment"
        onChange={(e) => setText(e.target.value)}
        value={text}
        placeholder="I hate this..."
        rows={5}
      />
      <button className={isPending ? "disabled" : ""} disabled={isPending}>submit</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}