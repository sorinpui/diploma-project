import { useState } from "react";
import { Link } from "react-router-dom";

// styles
import "./Signup.css";

// icons
import visOff from "../../assets/visibility-off.svg";
import visOn from "../../assets/visibility.svg";

// components
import Footer from "../../components/Footer";

// hooks
import { useSignup } from "../../hooks/useSignup";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contestant, setContestant] = useState(null); // true or false

  const [isEyeOff, setIsEyeOff] = useState(true);
  const [contestantBtn, setContestantBtn] = useState("");
  const [spectatorBtn, setSpectatorBtn] = useState("");

  const {signup, isPending, error, emptyFields} = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(firstName, lastName, email, password, age, contestant)
  };

  return (
    <div className="signup-page signup container">
      <header>
        <Link to="/">go back</Link>
        <h1>Online Piano Competition</h1>
        <Link to="/login">log in</Link>
      </header>
      <main>
        <div>
          <p>Please select one of the following:</p>
          <button
            className={`${contestantBtn}`}
            disabled={Boolean(contestantBtn)}
            onClick={() => {
              setContestant(true);
              setSpectatorBtn("disabled");
              setContestantBtn("selected");
            }}
          >contestant</button>
          <button 
            className={`${spectatorBtn}`}
            disabled={Boolean(spectatorBtn)}
            onClick={() => {
              setContestant(false);
              setContestantBtn("disabled");
              setSpectatorBtn("selected");
            }}
          >spectator</button>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First name:</label>
          <input
            id="firstName"
            type="text" 
            onChange={(e) => {setFirstName(e.target.value)}}
            value={firstName}
            style={emptyFields.includes("firstName") || (error && error.includes("first name")) ? errorBorder : {}}
          />
          <label htmlFor="lastName">Last name:</label>
          <input
            id="lastName"
            type="text" 
            onChange={(e) => {setLastName(e.target.value)}}
            value={lastName}
            style={emptyFields.includes("lastName") || (error && error.includes("last name")) ? errorBorder : {}}
          />
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            type="number" 
            onChange={(e) => {setAge(e.target.value)}}
            value={age}
            style={emptyFields.includes("age") || (error && error.includes("years old")) ? errorBorder : {}}
          />
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text" 
            onChange={(e) => {setEmail(e.target.value)}}
            value={email}
            style={emptyFields.includes("email") || (error && error.includes("email")) ? errorBorder : {}}
          />
          <div className="password-eye">
            <label htmlFor="password">Password:</label>
            <img
              src={isEyeOff ? visOff : visOn}
              alt="eye-off"
              onClick={() => setIsEyeOff(!isEyeOff)}
            />
          </div>
          <input
            id="password"
            type={isEyeOff ? "password" : "text"} 
            onChange={(e) => {setPassword(e.target.value)}}
            value={password}
            style={emptyFields.includes("password") || (error && error.includes("password")) ? errorBorder : {}}
          />
          <button className={isPending ? "disabled" : ""} disabled={isPending}>submit</button>
        </form>
        {error && <div className="error">{error}</div>}
      </main>
      <Footer />
    </div>
  )
}

const errorBorder = {
  border: "1px solid red"
};
