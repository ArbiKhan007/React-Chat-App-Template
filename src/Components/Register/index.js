import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import Axios from "axios";

function Register() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [phone, setPhone] = useState();
  const [errors, setErrors] = useState([]);
  let navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const resp = await Axios.post(
        "http://localhost:4000/register",
        {
          username,
          email,
          password,
          phoneNumber: phone,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (resp.data.errors) {
        setErrors(Object.values(resp.data.errors));
        console.log(errors);
      } else {
        navigate("/");
      }
    } catch (e) {
      setErrors((prev) => prev.push("Email Already taken"));
    }
  }

  return (
    <div className={styles.background}>
      <div onSubmit={handleSubmit} className={styles.formContainer}>
        <form className={styles.form} action="#">
          <div>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              type="text"
              name="username"
              id="username"
              placeholder="John Gamer"
            />
          </div>

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

          <div>
            <label className={styles.label} htmlFor="phone">
              Phone Number
            </label>
            <input
              onChange={(e) => setPhone(e.target.value)}
              className={styles.input}
              type="tele"
              name="phoneNumber"
              id="phone"
              placeholder="1919191919"
            />
          </div>

          <input className={styles.submit} type="submit" value="Register" />

          {errors.length
            ? errors.map((err) => {
                return (
                  <small
                    style={{ color: "#372c2c" }}
                    key={Math.random() * 10000000}
                  >
                    {err}
                  </small>
                );
              })
            : ""}

          <Link to="/">Login now</Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
