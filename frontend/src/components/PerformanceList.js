import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useFetch } from "../hooks/useFetch";
import { formatDistanceToNow } from "date-fns";

// hooks
import { useUserContext } from "../hooks/useUserContext";

const PerformanceList = ({url, contestantName}) => {
  const { user } = useUserContext();

  const [performances, setPerformances] = useState(null);
  const [isPending, setIsPending] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformances = async () => {
      setIsPending(true);
      setError(null);

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        setIsPending(false);
        setError(null);
        setPerformances(json);
      }
    };

    fetchPerformances();
  }, [url, user]);

  const navigate = useNavigate();

  const calculateScore = (int, dif, tec) => {
    return (int * 5 + dif * 4 + tec) / 10;
  };

  const filterContestants = (firstName, lastName) => {
    return !firstName.toLowerCase().includes(contestantName.toLowerCase()) && 
           !lastName.toLowerCase().includes(contestantName.toLowerCase());
  };

  return (
    <React.Fragment>
      {isPending && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <div className="performances">
        {performances && performances.map(performance => (
          <div
            key={performance._id}
            className={`card ${performance.period}`}
            onClick={() => navigate(`/home/${performance._id}`)}
            hidden={
              contestantName && 
              filterContestants(performance.performer_id.firstName, performance.performer_id.lastName)}
          >
            <h4>{performance.piece}</h4>
            <h5>{performance.composer}</h5>
            <p>{performance.performer_id.firstName} {performance.performer_id.lastName}, {performance.performer_id.age}</p>
            <p>Overall score: {calculateScore(performance.interpretation_score, performance.difficulty_score, performance.technical_score)}</p>
            <p className="updated">Last updated: {formatDistanceToNow(new Date(performance.updatedAt), {addSuffix: true})}</p>
          </div>
        ))}
      </div>
    </React.Fragment>
  )
};

export default PerformanceList;
