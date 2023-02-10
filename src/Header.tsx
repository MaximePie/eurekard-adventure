import React from "react";

export function Header({onLogout}: { onLogout: () => void }) {
  return (
    <h1 className="Header">
      <div className="Header__left">
        <span className="Header__left-action" role="button" onClick={onLogout}>Se déconnecter</span>
      </div>
    </h1>
  )
}