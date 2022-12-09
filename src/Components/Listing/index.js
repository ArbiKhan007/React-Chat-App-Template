import React, { useContext, useEffect, useState } from "react";
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
  const [showImageUploader, setShowImageUploader] = useState();
  const [uploadUserImage, setUploadUserImage] = useState();

  useEffect(() => {
    async function fetchUserGroups() {
      try {
        const groups = await Axios.post(
          "https://treechat-serv-dev.up.railway.app/get-groups",
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

    props.socket.on("user_add_server", ({ groupId }) => {
      async function getAddedGroupInfo() {
        try {
          const response = await Axios.post(
            "https://treechat-serv-dev.up.railway.app/get-singlegroup",
            {
              token: localStorage.getItem("jwt"),
              groupId,
            }
          );

          let data = response.data.group[0];

          dispatch({ type: "appendANewGroup", value: data });
          state.toast("You've been added to " + data.name);
        } catch (error) {
          console.log(error);
        }
      }

      getAddedGroupInfo();
    });
  }, []);

  function handleGroupCreate(e) {
    async function takeInput() {
      const { value: a } = await state.Swal.fire({
        title: "Create a new group",
        input: "text",
        inputLabel: "Group Name",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        },
      });

      if (a) {
        try {
          const response = await Axios.post(
            "https://treechat-serv-dev.up.railway.app/add-newgroup",
            {
              token: localStorage.getItem("jwt"),
              firstMember: localStorage.getItem("userId"),
              name: a,
            }
          );

          dispatch({ type: "appendANewGroup", value: response.data.group });
        } catch (error) {
          console.log(error);
        }
      }
    }

    takeInput();
  }

  function handleChatOpen(openedChat) {
    dispatch({ type: "setOpenedChat", value: openedChat });
  }

  return (
    <div className={styles.contactListing}>
      <div className={styles.contactHeader}>
        {showImageUploader ? <input type="file" /> : ""}
        <img
          onClick={() => setShowImageUploader((prev) => !prev)}
          className={styles.userAvatar}
          src={props.userAvatar || userImage}
          alt="User Avatar"
        />
        <div style={{ padding: "1rem" }}>
          {localStorage.getItem("username")}
        </div>
        <div className={styles.threeDots}>
          <img
            onClick={(e) => handleGroupCreate()}
            src={threeDots}
            alt="three dots"
          />
        </div>
      </div>

      {state.connectedUser.length ? (
        state.connectedUser.map((el) => {
          return (
            <User
              key={el._id}
              handleClickAction={(e) => handleChatOpen(el)}
              user={el}
            />
          );
        })
      ) : (
        <div
          style={{
            color: "#fff",
            margin: "20%",
            textAlign: "center",
            width: "200px",
            fontSize: "25px",
          }}
        >
          No groups..... 🥲
        </div>
      )}
    </div>
  );
}

export default Listing;
