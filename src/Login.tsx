import React, {FormEvent, useState} from "react";

export function Login({onLogin}: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="Login">
      <h2>Connexion</h2>
      <form onSubmit={onSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}/>
        </label>
        <label>
          Mot de passe
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        </label>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  )

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    axiosInstance.post("/users/login", {
      email,
      password
    }).then(response => {
      axiosInstance.defaults.headers.common["auth-token"] = response.data.token;
      if (response.data.token) {
        onLogin();
        // Save in local storage
        localStorage.setItem("token", response.data.token);
      } else {
        console.error("No token");
      }
    });
  }
}