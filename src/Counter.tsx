import React, {useContext, useEffect, useState} from "react";
import {GameContext} from "./GameProvider";
import {axiosInstance} from "./axios";
import {Card} from "./Card";

export function Counter() {

  // get score from context
  const {score, setScore, scorePerSecond} = useContext(GameContext);
  const [cards, setCards] = useState([] as any[]);

  // Rounded to 2 decimals
  const formattedScore = Math.round(score * 100) / 100;
  const formattedScorePerSecond = Math.round(scorePerSecond * 100) / 100;


  // Fetch cards from the API
  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div className="Counter">
      <h3>
        Score
        <span className="Counter__scorePerSecond">
          ({formattedScorePerSecond}kn/s)
        </span>
      </h3>
      <p>{formattedScore}</p>
      <div className="Cards">
        {cards.slice(0, 10).map((card, index) => (
          <Card key={card._id} card={card} onAnswer={onAnswer}/>
        ))}
      </div>
      <button onClick={fetchCards}>Fetch</button>
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

  function onAnswer(card: any, isSuccessful: boolean) {
    const cardId = card._id;
    // Update the score
    setScore(score + (isSuccessful ? card.currentDelay : 0));

    // Update the card
    const updatedCards = [...cards].filter(card => card._id !== cardId);
    setCards([...updatedCards]);
  }

  function fetchCards() {
    axiosInstance.get('/userCards')
      .then(response => {
        setCards(response.data.cards);
      })
  }
}