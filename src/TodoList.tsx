import React from "react";

export default function TodoList() {
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  const todo = [
    {text: 'Changer de main après une réponse', done: true},
    {text: 'Réparer le bonus', done: true},
    {text: 'Notifications sur bonus', done: false},
    {text: 'Acheter en masse, x1, x10, x100, max', done: true},
  ]

  if (isCollapsed) {
    return (
      <div className="Todolist Todolist--collapsed">
        <p className="Todolist--collapsed__task">{todo[todo.length - 1].text}</p>
        <button className="Todolist__button" onClick={() => setIsCollapsed(false)}>+</button>
      </div>
    )
  }
  return (
    <div className="Todolist">
      <h4>Todo</h4>
      <ul>
        {todo.map((item, index) => <li key={index} className={item.done ? 'Todolist__item--done' : ''}>{item.text}</li>)}
      </ul>
      <button className="Todolist__button" onClick={() => setIsCollapsed(true)}>-</button>
    </div>
  )
}