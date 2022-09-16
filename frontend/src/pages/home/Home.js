import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// styles
import "./Home.css";

// components
import Footer from "../../components/Footer";
import PerformanceList from "../../components/PerformanceList";

// hooks
import { useLogout } from "../../hooks/useLogout";

export default function Home() {
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const query = queryParams.get("period");

  let url = null;

  if (query) {
    url = `/api/performances?period=${query}`;
  } else {
    url = "/api/performances";
  }

  const [contestantName, setContestantName] = useState("");
  const { logout } = useLogout();

  const navigate = useNavigate();

  return (
    <div className="home container">
      <header>
        <Link to="/profile">profile</Link>
        <h1>Online Piano Competition</h1>
        <Link to="/" onClick={() => logout()}>log out</Link>
      </header>
      <main>
        <div className="btn-filter">
          <button onClick={() => navigate("/home")}>all</button>
          <button onClick={() => navigate("/home?period=baroque")} className="baroque">baroque</button>
          <button onClick={() => navigate("/home?period=classical")} className="classical">classical</button>
          <button onClick={() => navigate("/home?period=romantic")} className="romantic">romantic</button>
        </div>
        <div>
          <label htmlFor="search">Search:</label>
          <input
            id="search"
            type="text"
            onChange={(e) => setContestantName(e.target.value)}
            placeholder="contestant name"
            value={contestantName}
          />
        </div>
        <PerformanceList url={url} contestantName={contestantName} />
      </main>
      <Footer />
    </div>
  )
}
