import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// pages
import Welcome from "./pages/welcome/Welcome";
import Details from "./pages/details/Details";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Performance from "./pages/performance/Performance";

// hooks
import { useUserContext } from "./hooks/useUserContext";
import Profile from "./pages/profile/Profile";
import Standings from "./pages/standings/Standings";

function App() {
  const { user, authIsReady } = useUserContext();

  return (
    <div className="App">
      {authIsReady && <BrowserRouter>
        <Routes>
          <Route path="/" element={!user ? <Welcome /> : <Navigate to="/home" />} />
          <Route path="/details" element={!user ? <Details /> : <Navigate to="/home" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/home" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
          <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/home/:id" element={user ? <Performance /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/standings" element={user ? <Standings /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>}
    </div>
  );
}

export default App;
