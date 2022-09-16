import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

// styles
import "./Comment.css";

// context
import { useUserContext } from "../hooks/useUserContext";
import { usePerfContext} from "../hooks/usePerfContext";

export default function CommentList({performance_id, performer_email}) {
  const { user } = useUserContext();
  const { comments, dispatch } = usePerfContext();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setIsPending(true);
      setError(null);

      const response = await fetch(`/api/comments/${performance_id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      })

      const json = await response.json();

      if (response.ok) {
        setIsPending(false);
        setError(null);
        dispatch({type: "SET_COMMENTS", payload: json});
      }
    };

    fetchComments();
  }, [user, performance_id]);

  const handleClick = async (id) => {
    const response = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${user.token}`
      }
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.errorMessage);
    } else {
      dispatch({type: "DELETE_COMMENT", payload: json});
    }
  }

  return (
    <div className="comment-list">
      {isPending && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!isPending && comments && comments.map(comment => (
        <div className="comment" key={comment._id}>
          <div className="flex-container">
            <h4>{comment.author_id.firstName + " " + comment.author_id.lastName}</h4>
            <span
              style={user.email !== comment.author_id.email && user.email !== performer_email ? {display: "none"} : {}}
              className="material-symbols-outlined"
              onClick={() => handleClick(comment._id)}
            >delete</span>
          </div>
          <p>{comment.text}</p>
          <p className="updated">{formatDistanceToNow(new Date(comment.createdAt), {addSuffix: true})}</p>
        </div>
      ))}
      
    </div>
  )
}