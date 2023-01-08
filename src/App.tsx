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

type Effect = {
  target: string;
  multiplier: number;
}

type Bonus = {
  name: string;
  cost: number;
  effect: Effect;
  isBought: boolean;
  isAvailable: boolean;
}
type GameType = {
  score: number,
  setScore: (score: number) => void
  team: Member[],
  hire: (memberName: string) => void,
  scorePerSecond: number,
  bonusList: Bonus[],
  acquireBonus: (bonus: Bonus) => void
}

function GameProvider(props: any) {
  const [score, setScore] = useState(0);
  const [team, setTeam] = useState([
    {name: "André", age: 2, level: 0, cost: 10, scorePerSecond: 0.1},
    {name: "Marine", age: 20, level: 0, cost: 100, scorePerSecond: 1},
    {name: "Marie Curie", age: 220, level: 0, cost: 100000000, scorePerSecond: 100000},
  ]);

  const [bonusList, setBonusList] = useState([
    {
      name: "Canard en plastique", cost: 10, effect: {
        target: "André",
        multiplier: 2,
      },
      isBought: false,
      isAvailable: true,
    },
    {name: "Bureau marcheur", cost: 100, effect: {target: "Marine", multiplier: 2}, isAvailable: true, isBought: false},
  ]);

  const [scorePerSecond, setScorePerSecond] = useState(0.1);

  // Create an interval to update the score every second based on the scorePerSecond
  useEffect(() => {
    const interval = setInterval(() => {
      setScore(score => score + scorePerSecond / 10);
    }, 100);
    return () => clearInterval(interval);
  }, [scorePerSecond]);

  useEffect(() => {
    // Recalculate the scorePerSecond based on the team and the bonuses
    let newScorePerSecond = 0;
    team.forEach(member => {
      const bonus = bonusList.find(bonus => bonus.effect.target === member.name);
      newScorePerSecond += member.scorePerSecond * member.level * (bonus?.isBought ? bonus.effect.multiplier : 1);
    });

    setScorePerSecond(newScorePerSecond);
  }, [team, bonusList]);

  return (
    <GameContext.Provider value={{score, setScore, hire, team, scorePerSecond, bonusList, acquireBonus}}>
      {props.children}
    </GameContext.Provider>
  );

  /**
   * Acquire the bonus with the given name
   * Apply the effect of the bonus
   * @param bonus
   */
  function acquireBonus(bonus: Bonus) {
    // Update the bonus list
    setBonusList(bonusList => {
      return [...bonusList].map(b => {
        if (b.name === bonus.name) {
          return {...b, isBought: true, isAvailable: false}
        }
        return b;
      });
    });
  }

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
  const {team, hire, score} = useContext(GameContext);


  return (
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
  const {score, setScore, scorePerSecond} = useContext(GameContext);

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
      <button onClick={() => setScore(score + 10)}>
        +10
      </button>
      <button onClick={() => setScore(score + 100000)}>
        +100000
      </button>
    </div>
  )
}

function BonusList() {

  // get bonusList from context
  const {bonusList, acquireBonus, score} = useContext(GameContext);

  return (
    <div className="BonusList">
      <h3>Bonus</h3>
      {bonusList.filter(({isAvailable}) => isAvailable).map((bonus, index) => (
        <div key={index} className="Bonus">
          <p>
            {bonus.name} ({bonus.cost} kn)
          </p>
          <button disabled={score < bonus.cost} onClick={() => acquireBonus(bonus)}>Acheter</button>
        </div>
      ))}
    </div>
  )
}

function Game() {
  const [selectedPanel, setSelectedPanel] = useState<"team" | "bonus">("team");
  return (
    <GameProvider>
      <div className="Game">
        <Counter/>
        <div className="Upgrades">
          <h2>Améliorations</h2>
          <div className="Upgrades__tabs">
            <button
              onClick={() => setSelectedPanel("team")}
              className={selectedPanel === "team" ? "selected" : ""}
            >
              Équipe
            </button>
            <button
              onClick={() => setSelectedPanel("bonus")}
              className={selectedPanel === "bonus" ? "selected" : ""}
            >
              Bonus
            </button>
          </div>
          {selectedPanel === "team" && <Team/>}
          {selectedPanel === "bonus" && <BonusList/>}
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
