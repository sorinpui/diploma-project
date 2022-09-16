import { useState } from "react";
import { useUserContext } from "../hooks/useUserContext";
import { usePerfContext } from "../hooks/usePerfContext";
// styles
import "./PerformanceForms.css";

export default function PerformanceForms({length}) {
  const { user } = useUserContext();
  const { dispatch } = usePerfContext();

  const [piece, setPiece] = useState("");
  const [composer, setComposer] = useState("");
  const [video, setVideo] = useState(null);
  
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    if (!piece || !composer || !video) {
      setIsPending(false);
      setError("All fields are mandatory.");
      return;
    }

    let formData = new FormData();
    formData.append("file", video);
    formData.append("piece", piece);
    formData.append("composer", composer);

    if (length === 0) {
      formData.append("period", "baroque");
    }
    if (length === 1) {
      formData.append("period", "classical");
    }
    if (length === 2) {
      formData.append("period", "romantic");
    }

    const response = await fetch("/api/performances", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${user.token}`
      },
      body: formData
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.errorMessage);
    } else {
      setPiece("");
      setComposer("");
      setVideo(null);
      dispatch({type: "SET_PERFORMANCE", payload: json});
    }
  }

  const handleFileChange = (e) => {
    setVideo(null);
    const selected = e.target.files[0];
    console.log(selected);

    if (!selected) {
      setError("Please choose a video.");
      return;
    }

    if (!selected.type.includes("video")) {
      setError("File must be a video.");
      return;
    }

    setError(null);
    setVideo(selected);
    console.log("video updated");
  }

  return (
    <div className="performance-forms">
      <form className="baroque" onSubmit={handleSubmit}>
        <h2>Baroque performance</h2>
        <label htmlFor="baroque-piece">Piece:</label>
        <input
          type="text"
          id="baroque-piece"
          onChange={(e) => setPiece(e.target.value)}
          disabled={length !== 0}
          style={length === 0 && emptyFields.includes("piece") ? {border: "1px solid crimson"} : {}}
        />
        <label htmlFor="baroque-composer">Composer:</label>
        <input
          type="text"
          id="baroque-composer"
          onChange={(e) => setComposer(e.target.value)}
          disabled={length !== 0}
          style={length === 0 && emptyFields.includes("composer") ? {border: "1px solid crimson"} : {}}
        />
        <label htmlFor="baroque-performance">Performance:</label>
        <input
          type="file"
          id="baroque-performance"
          onChange={handleFileChange}
          disabled={length !== 0}
          style={length === 0 && emptyFields.includes("video") ? {border: "1px solid crimson"} : {}}
        />
        {length === 0 && error && <div className="error">{error}</div>}
        <button
          className={length !== 0 ? "disabled" : ""}
          disabled={length !== 0}
        >submit</button>
      </form>
      <form className="classical" onSubmit={handleSubmit}>
        <h2>Classical performance</h2>
        <label htmlFor="classical-piece">Piece:</label>
        <input
          type="text"
          id="classical-piece"
          onChange={(e) => setPiece(e.target.value)}
          disabled={length !== 1}
          style={length === 1 && emptyFields.includes("piece") ? {border: "1px solid crimson"} : {}}
        />
        <label htmlFor="classical-composer">Composer:</label>
        <input
          type="text"
          id="classical-composer"
          onChange={(e) => setComposer(e.target.value)}
          disabled={length !== 1}
          style={length === 1 && emptyFields.includes("composer") ? {border: "1px solid crimson"} : {}}
        />
        <label htmlFor="classical-performance">Performance:</label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          disabled={length !== 1}
          style={length === 1 && emptyFields.includes("video") ? {border: "1px solid crimson"} : {}}
        />
        {length === 1 && error && <div className="error">{error}</div>}
        <button
          className={length !== 1 ? "disabled" : ""}
          disabled={length !== 1}
        >submit</button>
      </form>
      <form className="romantic" onSubmit={handleSubmit}>
        <h2>Romantic performance</h2>
        <label htmlFor="classical-piece">Piece:</label>
        <input
          type="text"
          id="classical-piece"
          onChange={(e) => setPiece(e.target.value)}
          disabled={length !== 2}
          style={length === 2 && emptyFields.includes("piece") ? {border: "1px solid crimson"} : {}}
        />
        <label htmlFor="classical-composer">Composer:</label>
        <input
          type="text"
          id="classical-composer"
          onChange={(e) => setComposer(e.target.value)}
          disabled={length !== 2}
          style={length === 2 && emptyFields.includes("composer") ? {border: "1px solid crimson"} : {}}
        />
        <label htmlFor="classical-performance">Performance:</label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          disabled={length !== 2}
          style={length === 2 && emptyFields.includes("video") ? {border: "1px solid crimson"} : {}}
        />
        {length === 2 && error && <div className="error">{error}</div>}
        <button
          className={length !== 2 ? "disabled" : ""}
          disabled={length !== 2}
        >submit</button>
      </form>
    </div>  
  )
}