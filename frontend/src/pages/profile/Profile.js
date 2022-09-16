import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// styles
import "./Profile.css";

// components
import Footer from "../../components/Footer";
import PerformanceForms from "../../components/PerformanceForms";

// custom hooks
import { useLogout } from "../../hooks/useLogout";
import { useUserContext } from "../../hooks/useUserContext";
import { usePerfContext } from "../../hooks/usePerfContext";
import UpdateUserForm from "../../components/UpdateUserForm";

export default function Profile() {
  const { user } = useUserContext();
  const { perf } = usePerfContext();

  const [userData, setUserData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const [show, setShow] = useState(false);
  const { logout } = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setIsPending(true);
      setError(null);

      const response = await fetch(`/api/users/${user.email}`, {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (!response.ok) {
        setIsPending(false);
        setError(json.errorMessage);
      } else {
        setIsPending(false);
        setError(null);
        setUserData(json);
      }
    };

    fetchUser();
  }, [user, perf]);
  
  const handleClick = async (id) => {
    // delete user's videos from mongodb if they're a contestant
    if (userData.contestant) {
      const performances = userData.performances;

      performances.forEach(async performance => {
        // the id of the video stored in files collection
        let id = performance.video_id;

        await fetch(`/api/performances/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${user.token}`
          }
        });
      });
    }

    // detele user from database with fetch API
    await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${user.token}`
      }
    });

    logout();
    window.alert(`Your account has been successfully deleted.`);
  }

  return (
    <div className="profile-page container">
      <header>
        <Link to="/home">go back</Link>
        <h1>Online Piano Competition</h1>
        <Link to="/" onClick={() => logout()}>log out</Link>
      </header>
      <main>
        {error && <div className="error">{error}</div>}
        {userData && <div className="info-card">
          <h4>
            <span>Full name: </span>{userData.firstName + " " + userData.lastName}
            {userData.contestant 
              ? <span> (contestant)</span> : !user.email.includes("baroque") || !user.email.includes("classical") || !user.email.includes("romantic")
              ? <span> (spectator)</span> : <span> (judge)</span>}
          </h4>
          <p><span>Age: </span>{userData.age}</p>
          <p><span>Email: </span>{userData.email}</p>
          {userData.performances.map(performance => (
            <p className={performance.period} key={performance._id}>
              <span>{performance.period[0].toUpperCase() + performance.period.substring(1)} piece: </span>
              <span onClick={() => navigate(`/home/${performance._id}`)}>{performance.piece + ", " + performance.composer}</span>
            </p>
          ))}
          <div className="delete">
            <button
              className="delete-btn"
              disabled={show}
              onClick={() => setShow(true)}
            >delete account</button>
            <div style={show ? {display: "flex"} : {display: "none"}}>
              <p>Are you sure?</p>
              <button className="yes-btn" onClick={() => handleClick(userData._id)}>yes</button>
              <button className="no-btn" onClick={() => setShow(false)}>no</button>
            </div>
          </div>
        </div>}
        {!isPending && <Link to="/standings" className="standings-btn">see standings</Link>}
        {userData && userData.contestant && 
         userData.performances.length !== 3 &&
        <PerformanceForms length={userData.performances.length} />}
        {userData && (userData.performances.length === 3 || !userData.contestant) && <UpdateUserForm setUserData={setUserData}/>}
      </main>
      <Footer />
    </div>
  )
};