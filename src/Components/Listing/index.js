import React from "react";
import chats from "../../chats.json";
import User from "../User";
import styles from "./style.module.css";
import userImage from "./img_avatar.png";
import threeDots from "./threedots.png";

function Listing(props) {
  function handleChatOpen(e, user) {
    e.preventDefault();
    let userChats = chats.filter((chat) => {
      return chat.userId === user.userId;
    });

    console.log(userChats);
    props.setShowChat((prev) => userChats[0].messages);
    props.setUser((prev) => userChats[0].to);
  }

  return (
    <div className={styles.contactListing}>
      <div className={styles.contactHeader}>
        <img src={props.userAvatar || userImage} alt="User Avatar" srcset="" />

        <div className={styles.threeDots}>
          <img src={threeDots} alt="three dots" srcset="" />
        </div>
      </div>
      {chats.map((el) => {
        return (
          <User
            handleClickAction={(e) => handleChatOpen(e, el)}
            key={el.userId}
            userId={el.userId}
            username={el.to}
            lastMessage={el.messages[el.messages.length - 1]}
          />
        );
      })}
    </div>
  );
}

export default Listing;
