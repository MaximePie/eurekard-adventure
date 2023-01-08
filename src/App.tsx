import React, {useContext, useEffect, useState} from 'react'
import "./App.css"

function Header() {
  return (
    <h1>
      Le meilleur site de React
    </h1>
  )
}


const GameContext = React.createContext({} as GameType);

type Member = {
  name: string;
  age: number;
  level: number;
  cost: number;
}
type GameType = {
  score: number,
  setScore: (score: number) => void
  team: Member[],
  hire: (memberName: string) => void,
  scorePerSecond: number,
}

function GameProvider(props: any) {
  const [score, setScore] = useState(0);
  const [team, setTeam] = useState([
    { name: "André", age: 2, level: 0, cost: 10, scorePerSecond: 0.1 },
    { name: "Marine", age: 20, level: 0, cost: 100, scorePerSecond: 1},
    { name: "Marie Curie", age: 220, level: 0, cost: 100000000, scorePerSecond: 100000 },
  ]);

  const [scorePerSecond, setScorePerSecond] = useState(0.1);

  // Create an interval to update the score every second based on the scorePerSecond
  useEffect(() => {
    const interval = setInterval(() => {
      setScore(score => score + scorePerSecond / 10);
    }, 100);
    return () => clearInterval(interval);
  }, [scorePerSecond]);

  return (
    <GameContext.Provider value={{ score, setScore, hire, team, scorePerSecond }}>
      {props.children}
    </GameContext.Provider>
  );

  /**
   * Add one level to the member
   * @param name
   */
  function hire(name: string) {
    const newTeam = team.map(member => {
      if (member.name === name) {
        member.level += 1;
        // Remove the member's cost from the score
        setScore(score - member.cost);

        // Increase the cost of the member using fibonacci algorithm
        member.cost = Math.round(member.cost * 1.618);

        // Increase scorePerSecond based on the member's level
        setScorePerSecond(scorePerSecond + member.scorePerSecond);
      }
      return member;
    });
    setTeam(newTeam);
  }
}


function Team() {

  // get team from context
  const { team, hire, score } = useContext(GameContext);


  return(
    <div className="Team">
      <h3>Équipe</h3>
        {team.map((member, index) => (
          <div key={index}>
            <p>
              <span>{member.level} </span>
              {member.name} ({member.age} ans)
              <span> {member.cost} kn</span>
              <button disabled={score < member.cost} onClick={() => hire(member.name)}>Recruter</button>
            </p>
          </div>
        ))}
    </div>
  )

}

function Counter() {

  // get score from context
  const { score, setScore, scorePerSecond} = useContext(GameContext);

  // Rounded to 2 decimals
  const formattedScore = Math.round(score * 100) / 100;
  const formattedScorePerSecond = Math.round(scorePerSecond * 100) / 100;

  return (
    <div className="Counter">
      <h3>
        Score
        <span className="Counter__scorePerSecond">
          ({formattedScorePerSecond}kn/s)
        </span>
      </h3>
      <p>{formattedScore}</p>
      <button onClick={() => setScore(score + 1)}>
        +1
      </button>
    </div>
  )
}

function Game() {
    return (
      <GameProvider>
        <div className="Game">
          <Counter/>
          <div className="Upgrades">
            <h2>Améliorations</h2>
            <Team/>
          </div>
        </div>
      </GameProvider>
    )
}

function App() {

  return (
    <div className="App">
      <Header/>
      <Game/>
    </div>
  )
}

export default App
