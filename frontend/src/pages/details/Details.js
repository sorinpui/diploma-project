import { Link } from "react-router-dom";

// components
import Footer from "../../components/Footer";

export default function Details() {
  return (
    <div className="container">
      <header>
        <Link to="/">go back</Link>
        <h1>Online Piano Competition</h1>
        <Link to="/login">log in</Link>
      </header>
      <main>
        <h2>Rules</h2>
        <div>
          <p>
            In order to be eligible for competing, you must have <strong>three</strong> pieces.<br />
            Each piece has to be from a <strong>different</strong> time period (baroque, classical and romantic).<br />
            The time limit of each performance is 20 minutes.<br />
            Finally, the video performances must be recorded from the right side of the piano.<br />
            (We must see your hands and your face).<br />
            Also, you have to be at least 19 years old and not older than 23 to participate.
          </p>
        </div>
        <h2>Prizes</h2>
        <div>
          <p>
            There will be three prizes. One for first, second and third place.<br />
            The score will be calculated using a formula based on the overall scores of the three performances.<br />
            First place: 1000$<br />
            Second place: 750$<br />
            Third place: 500$<br />
          </p>
        </div>
        <h2>Judges</h2>
        <div>
          <p>
            There will be one judge for each category.<br />
            baroqueJudge<br/>
            classicalJudge<br />
            romanticJudge<br />
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
