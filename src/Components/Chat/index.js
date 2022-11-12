import React from "react";
import styles from "./style.module.css";
import avatar from "./img_avatar.png";
import threeDots from "./threedots.png";
import Input from "../Input";

function Chat(props) {
  return (
    <div className={styles.chatPanel}>
      <div className={styles.userBar}>
        <div className={styles.userImgContainer}>
          <img src={props.userAvatar || avatar} alt="user" />
        </div>
        <div className={styles.userInfo}>
          <span style={{ fontSize: "17px", padding: 0, display: "block" }}>
            {props.user}
          </span>
          <small style={{ fontSize: "12px", color: "#afacac" }}>
            {props.onlineStatus || "Last seen at"}
          </small>
        </div>

        <div className={styles.threeDots}>
          <img src={threeDots} alt="" srcset="" />
        </div>
      </div>

      <div className={styles.chatSection}>
        {props.messages.map((el, index) => {
          return (
            <div className={styles.chatBubbleContainer}>
              <div
                key={Math.random() * 1000000}
                style={
                  index % 2 === 0
                    ? { float: "left", backgroundColor: "#ebebeb" }
                    : { float: "right" }
                }
                className={styles.chatBubble}
              >
                {el}
              </div>
            </div>
          );
        })}
      </div>

      <Input className={styles.chatInput} />
    </div>
  );
}

export default Chat;
