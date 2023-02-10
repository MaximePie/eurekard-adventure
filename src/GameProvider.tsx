import React, {useEffect, useState} from "react";
import {Bonus, Member} from "./types";

type GameType = {
  score: number,
  setScore: (score: number) => void
  team: Member[],
  hire: (memberName: string, amount: number) => void,
  scorePerSecond: number,
  bonusList: Bonus[],
  acquireBonus: (bonus: Bonus) => void
}

export const GameContext = React.createContext({} as GameType);

export function GameProvider(props: any) {
  const [score, setScore] = useState(0);
  const [team, setTeam] = useState([
    {name: "André", age: 2, level: 0, cost: 10, scorePerSecond: 0.1},
    {name: "Marine", age: 20, level: 0, cost: 100, scorePerSecond: 1},
    {name: "Marie Curie", age: 220, level: 0, cost: 100000000, scorePerSecond: 100000},
  ]);

  const [bonusList, setBonusList] = useState([
    {
      name: "Canard en plastique",
      cost: 10,
      effect: {target: "André", multiplier: 2,},
      isBought: false,
      isAvailable: false,
      unlockedAt: {name: "André", level: 10}
    },
    {
      name: "Bureau marcheur",
      cost: 100,
      effect: {target: "Marine", multiplier: 2},
      isAvailable: false,
      isBought: false,
      unlockedAt: {name: "Marine", level: 10}
    },
  ]);

  const [scorePerSecond, setScorePerSecond] = useState(0);

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

      // If the bonus is not available, and the member is at the right level, make it available
      if (bonus && !bonus.isAvailable && member.level >= bonus.unlockedAt.level) {
        bonus.isAvailable = true;
        // Update the bonusList with the new bonus
        setBonusList(bonusList => [...bonusList]);
      }

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
   * @param baseAmount The amount of levels to add (-1 for max)
   */
  function hire(name: string, baseAmount: number = 1) {
    const newTeam = team.map(member => {
      if (member.name === name) {
        let maxAmount = baseAmount;
        let finalCost = member.cost;
        let newMemberCost = member.cost;
        if (baseAmount === -1) {
          // Calculate the max amount of levels that can be added
          let currentCost = member.cost;
          maxAmount = 1;
          while (score >= currentCost) {
            const costDelta = member.cost * Math.round(Math.pow(1.618, maxAmount));
            // Break if the max amount is reached
            if (score < currentCost + costDelta) {
              break;
            }
             maxAmount++;
             currentCost += costDelta;
          }
          finalCost = currentCost;
          newMemberCost = Math.round(member.cost * Math.pow(1.618, maxAmount));
        }
        else if (baseAmount !== 1) {
          finalCost = Math.round(member.cost * Math.pow(1.618, maxAmount));
          newMemberCost = Math.round(member.cost * Math.pow(1.618, maxAmount));
        }
        else if (baseAmount === 1) {
          newMemberCost = Math.round(member.cost * Math.pow(1.618, maxAmount));
        }

        member.level += maxAmount;

        setScore(score - finalCost);
        member.cost = newMemberCost;
        setScorePerSecond(scorePerSecond + member.scorePerSecond);
      }
      return member;
    });
    setTeam(newTeam);
  }
}