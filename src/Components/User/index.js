import React from "react";
import styles from "./style.module.css";
import avatar from "./img_avatar.png";

function User(props) {
  return (
    <div onClick={props.handleClickAction} className={styles.userTile}>
      <div className={styles.imgContainer}>
        <img src={props.userAvatar || avatar} alt={props.username} srcset="" />
      </div>

      <div>
        <span className={styles.userName}>{props.username}</span>
        <span className={styles.lastMessage}>{props.lastMessage}</span>
      </div>
    </div>
  );
}

export default User;
