import React, {useContext} from "react";
import { GameContext } from "./GameProvider";

export function BonusList() {

  // get bonusList from context
  const {bonusList, acquireBonus, score} = useContext(GameContext);

  return (
    <div className="BonusList">
      <h3>Bonus</h3>
      {bonusList.filter(({isAvailable, isBought}) => isAvailable && !isBought).map((bonus, index) => (
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