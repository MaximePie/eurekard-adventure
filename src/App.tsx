import React, {useState} from 'react'
import "./App.css"
import {Header} from "./Header";
import {Game} from "./Game";
import {Login} from "./Login";
import TodoList from "./TodoList";


function App() {
  // If there is a token in local storage, use it
  const [currentPage, setCurrentPage] = useState<"login" | "game">(localStorage.getItem("token") ? "game" : "login");

  return (
    <div className="App">
      <Header onLogout={() => setCurrentPage("login")}/>
      {currentPage === "login" && <Login onLogin={() => setCurrentPage("game")}/>}
      {currentPage === "game" && <Game/>}
      <TodoList/>
    </div>
  )
}

export default App
