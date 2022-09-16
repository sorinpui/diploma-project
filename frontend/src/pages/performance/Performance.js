import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// styles
import "./Performance.css";

// components
import Footer from "../../components/Footer";
import NewCommentForm from "../../components/NewCommentForm";
import CommentList from "../../components/CommentList";
import ScoreForm from "../../components/ScoreForm";

// hooks
import { usePerfContext } from "../../hooks/usePerfContext";
import { useLogout } from "../../hooks/useLogout";
import { useUserContext } from "../../hooks/useUserContext";

export default function Performance() {
  const { user } = useUserContext();
  const { perf, dispatch } = usePerfContext();
  const { id } = useParams();
  const { logout } = useLogout();

  const [isPending, setIsPending] = useState(null);
  const [error, setError] = useState(null);
  
  const [filename, setFilename] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerformance = async () => {
      setIsPending(true);
      setError(null);

      const response = await fetch(`/api/performances/${id}`, {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        setIsPending(false);
        setError(null);
        dispatch({type: "SET_PERFORMANCE", payload: json});

        const response = await fetch(`/api/performances/download/${json.video_id}`, {
          headers: {
            "Authorization": `Bearer ${user.token}`
          }
        });

        const fileExtension = response.headers.get("Content-Type").split("/")[1];
        const performer = json.performer_id;
        const { firstName, lastName } = performer;
        let { piece, composer } = json;
        const filename = `${firstName}_${lastName}_${piece}_${composer}.${fileExtension}`;
        setFilename(filename.replaceAll(" ", "_"));

        const blob = await response.blob();
        if (blob) {
          setDownloadURL(window.URL.createObjectURL(blob));
        }
      }
    };

    fetchPerformance();
  }, [id, user]);

  return (
    <div className="performance-page container">
      <header>
        <button onClick={() => navigate(-1)}>go back</button>
        <h1>Online Piano Competition</h1>
        <Link to="/" onClick={() => logout()}>log out</Link>
      </header>
      <main>
        {isPending && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!isPending && <div className="card-form">
          {perf && <div className="card">
            <h4><span>Performer: </span>{perf.performer_id.firstName + " " + perf.performer_id.lastName}</h4>
            <p><span>Piece: </span>{perf.piece}</p>
            <p><span>Composer: </span>{perf.composer}</p>
            <p><span>Interpretion score: </span>{perf.interpretation_score}</p>
            <p><span>Difficulty score: </span>{perf.difficulty_score}</p>
            <p><span>Technical score: </span>{perf.technical_score}</p>
            <a
              href={downloadURL}
              download={filename}
              disabled={!downloadURL}
              className={!downloadURL ? "disabled" : ""}
            >download performance</a>
          </div>}
          {perf && user.email.includes(perf.period) && <ScoreForm id={id}/>}
          {perf && !user.email.includes(perf.period) && <NewCommentForm performance_id={perf._id}/>}
          {perf && <CommentList performance_id={perf._id} performer_email={perf.performer_id.email}/>}
        </div>}
      </main>
      <Footer />
    </div>
  )
}
