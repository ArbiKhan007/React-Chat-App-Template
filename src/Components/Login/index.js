import React, { useState, useContext } from "react";
import Axios from "axios";
import styles from "./style.module.css";
import { Link } from "react-router-dom";
import DispatchContext from "../../DispatchContext";
import StateContext from "../../StateContext";
////

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [errors, setErrors] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const resp = await Axios.post(
        "http://localhost:4000/login",
        {
          email,
          password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (resp.data.errors) {
        console.log(resp.data.errors);
      }

      if (resp.data.token) {
        localStorage.setItem("jwt", resp.data.token);
        localStorage.setItem("userId", resp.data.userId);
        localStorage.setItem("username", resp.data.username);
        dispatch({ type: "setCurrentUser", value: resp.data.userId });
        dispatch({ type: "setLoggedIn" });
      }
    } catch (e) {
      setErrors(e.response.data.message);
    }
  }

  return (
    <div className={styles.background}>
      <div onSubmit={handleSubmit} className={styles.formContainer}>
        <form className={styles.form} action="#">
          <div>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              type="email"
              name="email"
              id="email"
              placeholder="john12@gamer.com"
            />
          </div>

          <div>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              type="password"
              name="password"
              id="password"
            />
          </div>

          <input className={styles.submit} type="submit" value="Login" />

          <span style={{ color: "red" }}>{errors}</span>

          <Link to="/register">Signup now</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
