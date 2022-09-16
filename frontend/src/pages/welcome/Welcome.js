import { Link } from "react-router-dom";

// styles
import "./Welcome.css";

// assets
import pianoSVG from "../../assets/piano.svg";

// components
import Footer from "../../components/Footer";

export default function Welcome() {
  return (
    <div className="welcome-page container">
      <header>
        <Link to="/details">details</Link>
        <h1>Online Piano Competition</h1>
        <Link to="/login">log in</Link>
      </header>
      <main>
        <div>
          <h2>Welcome to the first edition of the Online Piano Competition!</h2>
          <p>To see the rules, prizes and everything you need to know, click on the button in the top left corner.</p>
          <p>After you've done that, if you wish to participate, do it now!</p>
          <Link to="/signup">participate</Link>
          <p>If not, you can still sign up as a viewer:</p>
          <Link to="/signup">sign up</Link>
        </div>
        <div>
          <img src={pianoSVG} alt="piano-icon" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
