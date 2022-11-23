import React, { useContext, useEffect } from "react";
import Axios from "axios";

//
import User from "../User";
import styles from "./style.module.css";
import userImage from "./img_avatar.png";
import threeDots from "./threedots.png";

//context
import DispatchContext from "../../DispatchContext";
import StateContext from "../../StateContext";

function Listing(props) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    async function fetchUserGroups() {
      try {
        const groups = await Axios.post(
          "http://localhost:4000/get-groups",
          { token: localStorage.getItem("jwt") },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log(groups);

        console.log(groups.data.groups);

        dispatch({ type: "setConnectedUsers", value: groups.data.groups });
      } catch (error) {
        dispatch({ type: "setLoggedOut" });
      }
    }

    fetchUserGroups();
  }, []);

  function handleChatOpen(openedChat) {
    dispatch({ type: "setOpenedChat", value: openedChat });
  }

  return (
    <div className={styles.contactListing}>
      <div className={styles.contactHeader}>
        <img src={props.userAvatar || userImage} alt="User Avatar" />
        <div style={{ padding: "1rem" }}>
          {localStorage.getItem("username")}
        </div>
        <div className={styles.threeDots}>
          <img src={threeDots} alt="three dots" />
        </div>
      </div>

      {state.connectedUser.map((el) => {
        return (
          <User
            key={el._id}
            handleClickAction={(e) => handleChatOpen(el)}
            user={el}
          />
        );
      })}
    </div>
  );
}

export default Listing;
