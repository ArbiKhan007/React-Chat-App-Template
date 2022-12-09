import React, { useContext } from "react";
import styles from "./style.module.css";
import avatar from "./img_avatar.png";
import StateContext from "../../StateContext";

function User(props) {
  //const state = useContext(StateContext);

  return (
    <div
      data-user-id={props.user._id}
      onClick={props.handleClickAction}
      className={styles.userTile}
    >
      <div className={styles.imgContainer}>
        <img src={props.user.userAvatar || avatar} alt={props.user.username} />
      </div>

      <div>
        <span className={styles.userName}>{props.user.name}</span>
        <span className={styles.lastMessage}>{props.user.lastMessage}</span>
      </div>
    </div>
  );
}

export default User;
