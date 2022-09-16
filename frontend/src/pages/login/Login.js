import { Link } from "react-router-dom";
import { useState } from "react";

// hooks
import { useLogin } from "../../hooks/useLogin";

// components
import Footer from "../../components/Footer";

// styles
import "./Login.css";

// icons
import visOff from "../../assets/visibility-off.svg";
import visOn from "../../assets/visibility.svg";

export default function Login() {
  const [isEyeOff, setIsEyeOff] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {isPending, error, login, emptyFields} = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <div className="login-page container">
      <header>
        <Link to="/">go back</Link>
        <h1>Online Piano Competition</h1>
        <Link to="/signup">sign up</Link>
      </header>
      <main>
        <h2>Please input your credentials.</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input 
            type="text" 
            onChange={(e) => {setEmail(e.target.value)}}
            value={email}
            style={emptyFields.includes("email") || (error && error.includes("email")) ? {border: "1px solid red"} : {}}
          />
          <div className="password-eye">
            <label>Password:</label>
            <img
              src={isEyeOff ? visOff : visOn}
              alt="eye-off"
              onClick={() => setIsEyeOff(!isEyeOff)}
            />
          </div>
          <input 
            type={isEyeOff ? "password" : "text"} 
            onChange={(e) => {setPassword(e.target.value)}}
            value={password}
            style={emptyFields.includes("password") || (error && error.includes("password")) ? {border: "1px solid red"} : {}}
          />
          <button className={isPending ? "disabled" : ""} disabled={isPending}>submit</button>
        </form>
        {error && <div className="error">{error}</div>}
      </main>
      <Footer />
    </div>
  )
}
