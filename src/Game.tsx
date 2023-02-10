import React, {useState} from "react";
import {Counter} from "./Counter";
import {BonusList} from "./BonusList";
import {GameProvider} from "./GameProvider";
import {Team} from "./Team";


export function Game() {
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