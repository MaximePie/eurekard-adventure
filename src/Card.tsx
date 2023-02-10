import React, {useState} from "react";
import {axiosInstance} from "./axios";

export function Card({card, onAnswer}: { card: any, onAnswer: (cardId: string, isSuccessful: boolean) => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const classnames = isFlipped ? "Card Card--flipped" : "Card";

  return (
    <div className={classnames} onClick={onFlip}>
      <span className="Card__score">{card.currentDelay}</span>
      <p className="Card__content">{isFlipped ? card.answer : card.question}</p>
      {isFlipped && (
        <div className="Card__actions">
          <button className="Card__action" onClick={onSuccess}>✔️</button>
          <button className="Card__action" onClick={onFailure}>❌</button>
        </div>
      )}
    </div>
  )

  /**
   * When the user clicks on the success button
   * Send a request to the API to update the card
   * Trigger the parent component to update the score and cards
   */
  function onSuccess() {
    axiosInstance.post(`/userCards/update/${card._id}`, {isSuccessful: true});
    onAnswer(card, true);
  }

  function onFailure() {
    axiosInstance.post(`/userCards/update/${card._id}`, {isSuccessful: false});
    onAnswer(card, false);
  }

  // Flip the card once
  function onFlip() {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  }

}