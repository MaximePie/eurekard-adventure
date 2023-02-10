import React, {useContext} from "react";
import {GameContext} from "./GameProvider";

export function Team() {

  // get team from context
  const {team, hire, score} = useContext(GameContext);

  const canBuy = (cost: number, amount: number) => {
    return Math.round(cost * Math.pow(1.618, amount)) <= score;
  }

  return (
    <div className="Team">
      <h3>Équipe</h3>
      {team.map((member, index) => (
        <div key={index}>
          <p>
            <span>{member.level} </span>
            {member.name} ({member.age} ans)
            <span> {member.cost} kn</span>
            <div className="Team__buyButtons">
              <button disabled={score < member.cost} onClick={() => hire(member.name, 1)}>+1</button>
              <button disabled={!canBuy(member.cost, 10)} onClick={() => hire(member.name, 10)}>+10</button>
              <button disabled={!canBuy(member.cost, 100)} onClick={() => hire(member.name, 100)}>+100</button>
              <button disabled={score < member.cost} onClick={() => hire(member.name, -1)}>Max</button>
            </div>
          </p>
        </div>
      ))}
    </div>
  )

}