import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// styles
import "./Standings.css";

// hooks
import { useLogout } from "../../hooks/useLogout";
import { useUserContext } from "../../hooks/useUserContext";

// components
import Footer from "../../components/Footer";

export default function Standings() {
  const { user } = useUserContext();
  const { logout } = useLogout();

  const [performers, setPerformers] = useState([]);
  const sortBy = useRef("finalScore");
  const sortOrder = useRef("ascending");
  
  const [changeTable, setChangeTable] = useState(false);
  const [performances, setPerformances] = useState([]);

  const easyFields = ["finalScore", "firstName", "lastName", "age"];
  const hardFields = ["piece", "composer", "interpretation_score", "difficulty_score", "technical_score"];
  
  useEffect(() => {
    const fetchPerformers = async () => {
      const response = await fetch("/api/users/performers", {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });

      const json = await response.json();

      if (response.ok) {
        return json;
      }
    };

    fetchPerformers().then((data) => initializeTable(data));
  }, [user]);

  useEffect(() => {
    if (changeTable) {
      // console.log("Table has been changed:", changeTable);
      let performances = [];
      const rows = Array.from(document.getElementById("standings").rows);
      rows.shift();

      for (let i = 0; i < rows.length; i++) {
        performances.push({
          place:                Number(rows[i].cells[0].innerHTML),
          firstName:            rows[i].cells[1].innerHTML,
          lastName:             rows[i].cells[2].innerHTML,
          age:                  Number(rows[i].cells[3].innerHTML),
          piece:                rows[i].cells[4].innerHTML,
          composer:             rows[i].cells[5].innerHTML,
          interpretation_score: Number(rows[i].cells[6].innerHTML),
          difficulty_score:     Number(rows[i].cells[7].innerHTML),
          technical_score:      Number(rows[i].cells[8].innerHTML),
          finalScore:           Number(rows[i].cells[9].innerHTML)
        });
      }
      setPerformances(performances);
      // console.log(performances)
    }
    if (!changeTable) {
      setPerformances([]);
    }
  }, [changeTable]);

  const compareFunction = (a, b) => {
    if (
      sortBy.current === "finalScore" || 
      sortBy.current === "age" ||
      sortBy.current === "interpretation_score" ||
      sortBy.current === "difficulty_score" ||
      sortBy.current === "technical_score"
    ) {
      const numberField = sortBy.current;

      if (sortOrder.current === "ascending") {
        return b[numberField] - a[numberField];
      }
  
      if (sortOrder.current === "descending") {
        return a[numberField] - b[numberField];
      }
    }

    if (
      sortBy.current === "firstName" || 
      sortBy.current === "lastName" || 
      sortBy.current === "piece" || 
      sortBy.current === "composer"
    ) {
      const stringField = sortBy.current;
      const nameA = a[stringField].toUpperCase();
      const nameB = b[stringField].toUpperCase();

      if (sortOrder.current === "ascending") {
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }
      if (sortOrder.current === "descending") {
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        return 0;
      }
    }
  }

const initializeTable = (performers) => {
  // the table won't display the performers without 3 performances already uploaded
  performers = performers.filter(performer => performer.performances.length === 3);

  // set the performers with added data like each piece's overall score and the final overall score
  performers = performers.map(performer => {
    // for each performance add a new field called pieceScore,
    // which is the overall score of the piece
    let updatedPerformances = performer.performances.map(performance => {
      let { interpretation_score, difficulty_score, technical_score } = performance;
      let pieceScore = (interpretation_score * 5 + difficulty_score * 4 + technical_score) / 10;
      return {...performance, pieceScore};
    });

    // for the performer, calculate the average final score
    // using the pieces' pieceScore
    let finalScore = updatedPerformances
      .map(performance => performance.pieceScore)
      .reduce((prev, curr) => prev + curr, 0) / 3;
      finalScore = Number(finalScore.toFixed(2));
    return {...performer, performances: updatedPerformances, finalScore};
  });

  // performers.sort((a, b) => b["finalScore"] - a["finalScore"]);
  performers.sort(compareFunction);
  
  let place = 0;
  setPerformers(performers.map(performer => {
    place += 1;
    return {...performer, place};
  }));
}

  const sortByPlace = () => {
    setChangeTable(false);
    sortBy.current = "finalScore";
    sortOrder.current = sortOrder.current === "ascending" ? "descending" : "ascending";
    let sortedPerformers = performers.sort(compareFunction);
    setPerformers([...sortedPerformers]);
  }

  const sortByFirstName = () => {
    setChangeTable(false);
    sortBy.current = "firstName";
    sortOrder.current = sortOrder.current === "ascending" ? "descending" : "ascending";
    let sortedPerformers = performers.sort(compareFunction);
    setPerformers([...sortedPerformers]);
  }

  const sortByLastName = () => {
    setChangeTable(false);
    sortBy.current = "lastName";
    sortOrder.current = sortOrder.current === "ascending" ? "descending" : "ascending";
    let sortedPerformers = performers.sort(compareFunction);
    setPerformers([...sortedPerformers]);
  }

  const sortByAge = () => {
    setChangeTable(false);
    sortBy.current = "age";
    sortOrder.current = sortOrder.current === "ascending" ? "descending" : "ascending";
    let sortedPerformers = performers.sort(compareFunction);
    setPerformers([...sortedPerformers]);
  }

  const sortByPiece = () => {
    setChangeTable(true);
    sortBy.current = "piece";
    sortOrder.current = sortOrder.current === "ascending" ? "descending" : "ascending";

    if (!changeTable) {
      return;
    }

    performances.sort(compareFunction);
    const rows = document.getElementById("standings").rows;

    for (let i = 1; i < rows.length; i++) {
      rows[i].removeAttribute("class");
      if (performances[i-1].place === 1) {
        rows[i].setAttribute("class", "gold");
      }
      if (performances[i-1].place === 2) {
        rows[i].setAttribute("class", "silver");
      }
      if (performances[i-1].place === 3) {
        rows[i].setAttribute("class", "bronze");
      }

      let pos = 0;
      for (const property in performances[i-1]) {
        rows[i].cells[pos++].innerHTML = performances[i-1][property];
      }
    }
  }

  const sortByComposer = () => {
    setChangeTable(true);
    sortBy.current = "composer";
    sortOrder.current = sortOrder.current === "ascending" ? "descending" : "ascending";

    if (!changeTable) {
      return;
    }

    performances.sort(compareFunction);

    const rows = document.getElementById("standings").rows;

    for (let i = 1; i < rows.length; i++) {
      if (performances[i-1].place === 1) {
        rows[i].setAttribute("class", "gold");
      }
      if (performances[i-1].place === 2) {
        rows[i].setAttribute("class", "silver");
      }
      if (performances[i-1].place === 3) {
        rows[i].setAttribute("class", "bronze");
      }

      let pos = 0;
      for (const property in performances[i-1]) {
        rows[i].cells[pos++].innerHTML = performances[i-1][property];
      }
    }
  }

  const sortByIntScore = () => {
    setChangeTable(true);
    sortBy.current = "interpretation_score";
    sortOrder.current = sortOrder.current === "ascending" ? "descending" : "ascending";

    if (!changeTable) {
      return;
    }

    performances.sort(compareFunction);
    const rows = document.getElementById("standings").rows;

    for (let i = 1; i < rows.length; i++) {
      if (performances[i-1].place === 1) {
        rows[i].setAttribute("class", "gold");
      }
      if (performances[i-1].place === 2) {
        rows[i].setAttribute("class", "silver");
      }
      if (performances[i-1].place === 3) {
        rows[i].setAttribute("class", "bronze");
      }

      let pos = 0;
      for (const property in performances[i-1]) {
        rows[i].cells[pos++].innerHTML = performances[i-1][property];
      }
    }
  }

  const sortByDiffScore = () => {
    setChangeTable(true);
    sortBy.current = "difficulty_score";
    sortOrder.current = sortOrder.current === "ascending" ? "descending" : "ascending";

    if (!changeTable) {
      return;
    }

    performances.sort(compareFunction);
    const rows = document.getElementById("standings").rows;

    for (let i = 1; i < rows.length; i++) {
      if (performances[i-1].place === 1) {
        rows[i].setAttribute("class", "gold");
      }
      if (performances[i-1].place === 2) {
        rows[i].setAttribute("class", "silver");
      }
      if (performances[i-1].place === 3) {
        rows[i].setAttribute("class", "bronze");
      }

      let pos = 0;
      for (const property in performances[i-1]) {
        rows[i].cells[pos++].innerHTML = performances[i-1][property];
      }
    }
  }

  const sortByTechScore = () => {
    setChangeTable(true);
    sortBy.current = "technical_score";
    sortOrder.current = sortOrder.current === "ascending" ? "descending" : "ascending";

    if (!changeTable) {
      return;
    }

    performances.sort(compareFunction);
    const rows = document.getElementById("standings").rows;

    for (let i = 1; i < rows.length; i++) {
      if (performances[i-1].place === 1) {
        rows[i].setAttribute("class", "gold");
      }
      if (performances[i-1].place === 2) {
        rows[i].setAttribute("class", "silver");
      }
      if (performances[i-1].place === 3) {
        rows[i].setAttribute("class", "bronze");
      }

      let pos = 0;
      for (const property in performances[i-1]) {
        rows[i].cells[pos++].innerHTML = performances[i-1][property];
      }
    }
  }

  // console.log(performers, sortBy.current, sortOrder.current);

  return (
    <div className="standings-page container">
      <header>
        <Link to="/profile">go back</Link>
        <h1>Online Piano Competition</h1>
        <Link to="/" onClick={() => logout()}>log out</Link>
      </header>
      <main>
        <h4>Press any column header (i.e. first name, last name) to sort the table.</h4>
        <table id="standings">
          <thead>
            <tr>
              <th onClick={() => sortByPlace()}>No.</th>
              <th onClick={() => sortByFirstName()}>First Name</th>
              <th onClick={() => sortByLastName()}>Last Name</th>
              <th onClick={() => sortByAge()}>Age</th>
              <th onClick={() => sortByPiece()}>Piece</th>
              <th onClick={() => sortByComposer()}>Composer</th>
              <th onClick={() => sortByIntScore()}>Interpretation Score</th>
              <th onClick={() => sortByDiffScore()}>Difficulty Score</th>
              <th onClick={() => sortByTechScore()}>Technical Score</th>
              <th>Final Score</th>
            </tr>
          </thead>
          {easyFields.includes(sortBy.current) && <tbody>
            {performers.map(performer => (
              <React.Fragment key={performer._id}>
                <tr className={
                  performer.place === 1 ? "gold" : 
                  performer.place === 2 ? "silver" : 
                  performer.place === 3 ? "bronze" : ""
                }>
                  <td rowSpan={3}>{performer.place}</td>
                  <td rowSpan={3}>{performer.firstName}</td>
                  <td rowSpan={3}>{performer.lastName}</td>
                  <td rowSpan={3}>{performer.age}</td>
                  <td>{performer.performances[0].piece}</td>
                  <td>{performer.performances[0].composer}</td>
                  <td>{performer.performances[0].interpretation_score}</td>
                  <td>{performer.performances[0].difficulty_score}</td>
                  <td>{performer.performances[0].technical_score}</td>
                  <td rowSpan={3}>{performer.finalScore}</td>
                </tr>
                <tr className={
                  performer.place === 1 ? "gold" : 
                  performer.place === 2 ? "silver" : 
                  performer.place === 3 ? "bronze" : ""
                }>
                  <td>{performer.performances[1].piece}</td>
                  <td>{performer.performances[1].composer}</td>
                  <td>{performer.performances[1].interpretation_score}</td>
                  <td>{performer.performances[1].difficulty_score}</td>
                  <td>{performer.performances[1].technical_score}</td>
                </tr>
                <tr className={
                  performer.place === 1 ? "gold" : 
                  performer.place === 2 ? "silver" : 
                  performer.place === 3 ? "bronze" : ""
                }>
                  <td>{performer.performances[2].piece}</td>
                  <td>{performer.performances[2].composer}</td>
                  <td>{performer.performances[2].interpretation_score}</td>
                  <td>{performer.performances[2].difficulty_score}</td>
                  <td>{performer.performances[2].technical_score}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>}
          {hardFields.includes(sortBy.current) && <tbody>
            {performers.map(performer => (
              <React.Fragment key={performer._id}>
                <tr className={
                  performer.place === 1 ? "gold" : 
                  performer.place === 2 ? "silver" : 
                  performer.place === 3 ? "bronze" : ""
                }>
                  <td>{performer.place}</td>
                  <td>{performer.firstName}</td>
                  <td>{performer.lastName}</td>
                  <td>{performer.age}</td>
                  <td>{performer.performances[0].piece}</td>
                  <td>{performer.performances[0].composer}</td>
                  <td>{performer.performances[0].interpretation_score}</td>
                  <td>{performer.performances[0].difficulty_score}</td>
                  <td>{performer.performances[0].technical_score}</td>
                  <td>{performer.finalScore}</td>
                </tr>
                <tr className={
                  performer.place === 1 ? "gold" : 
                  performer.place === 2 ? "silver" : 
                  performer.place === 3 ? "bronze" : ""
                }>
                  <td>{performer.place}</td>
                  <td>{performer.firstName}</td>
                  <td>{performer.lastName}</td>
                  <td>{performer.age}</td>
                  <td>{performer.performances[1].piece}</td>
                  <td>{performer.performances[1].composer}</td>
                  <td>{performer.performances[1].interpretation_score}</td>
                  <td>{performer.performances[1].difficulty_score}</td>
                  <td>{performer.performances[1].technical_score}</td>
                  <td>{performer.finalScore}</td>
                </tr>
                <tr className={
                  performer.place === 1 ? "gold" : 
                  performer.place === 2 ? "silver" : 
                  performer.place === 3 ? "bronze" : ""
                }>
                  <td>{performer.place}</td>
                  <td>{performer.firstName}</td>
                  <td>{performer.lastName}</td>
                  <td>{performer.age}</td>
                  <td>{performer.performances[2].piece}</td>
                  <td>{performer.performances[2].composer}</td>
                  <td>{performer.performances[2].interpretation_score}</td>
                  <td>{performer.performances[2].difficulty_score}</td>
                  <td>{performer.performances[2].technical_score}</td>
                  <td>{performer.finalScore}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>}
        </table>
      </main>
      <Footer />
    </div>
  )
}