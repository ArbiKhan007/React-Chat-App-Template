import React, { useContext, useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import Axios from "axios";

import styles from "./style.module.css";
import avatar from "./img_avatar.png";
import Input from "../Input";

//context
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";

//

function Chat(props) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [userList, setUserList] = useState([]);
  //const [sendersSet, setSendersSet] = useState(new Set());
  const [showUserList, setShowUserList] = useState(false);
  const submitRef = useRef(null);
  const bottomRef = useRef(null);
  const clearRef = useRef(null);
  const listInnerRef = useRef();

  const [currPage, setCurrPage] = useState(1); // storing current page number
  const [prevPage, setPrevPage] = useState(0); // storing prev page number
  const [userChats, setUserChats] = useImmer([]); // storing chats
  const [wasLastList, setWasLastList] = useState(false); // setting a flag to know the last list

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [userChats]);

  useEffect(() => {
    if (!state.openedChat._id) {
      return;
    }

    //pagination
    const fetchData = async () => {
      console.log("fetch data page " + currPage);
      const response = await Axios.post(
        `http://localhost:4000/get-chats?page=${currPage}&limit=20`,
        {
          token: localStorage.getItem("jwt"),
          groupId: state.openedChat._id,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      response.data.chats.forEach((el) => {
        el.dateTime = formatAMPM(new Date(el.dateTime));
      });

      if (!response.data.chats.length) {
        setWasLastList(true);
        return;
      }

      setPrevPage(currPage);
      setUserChats((draft) => {
        draft.unshift(...response.data.chats);
      });
      //setUserChats([...userChats, ...response.data.chats]);
      dispatch({ type: "setIsLoading", value: false });
    };

    console.log(wasLastList, prevPage, currPage);

    if (!wasLastList && prevPage !== currPage) {
      console.log("function");
      fetchData();
    }
  }, [currPage, wasLastList, prevPage, userChats]);

  useEffect(() => {
    props.socket.on("chat from server", ({ message, senderName }) => {
      console.log("hello from server");
      let chatObj = {
        chatText: message,
        senderName,
        dateTime: formatAMPM(new Date()),
      };

      setUserChats((draft) => {
        draft.push(chatObj);
      });
    });
  }, []);

  useEffect(() => {
    props.socket.emit("join chat", {
      room: state.openedChat._id,
      userId: localStorage.getItem("userId"),
    });

    if (!state.openedChat._id) {
      return;
    }

    setWasLastList(false);
    setCurrPage(1);
    setPrevPage(0);

    async function getConnectedUserChat() {
      setShowUserList(false);

      try {
        const chats = await Axios.post(
          "http://localhost:4000/get-chats",
          {
            token: localStorage.getItem("jwt"),
            groupId: state.openedChat._id,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        chats.data.chats.forEach((el) => {
          el.dateTime = formatAMPM(new Date(el.dateTime));
        });

        console.log(chats.data.chats);

        // chats.data.chats.forEach((el) => {
        //   setSendersSet((prev) => prev.add(el.senderId));
        // });

        setUserChats(chats.data.chats);
        setCurrPage((prev) => prev + 1);
        setPrevPage((prev) => prev + 1);

        dispatch({ type: "setIsLoading", value: false });
      } catch (error) {
        console.log(error);
      }
    }

    getConnectedUserChat();
  }, [state.openedChat._id]);

  const onScroll = () => {
    if (listInnerRef.current) {
      //const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (listInnerRef.current.scrollTop === 0) {
        // This will be triggered after hitting the last element.
        // API call should be made here while implementing pagination.
        setCurrPage(currPage + 1);
      }
    }
  };

  function handleChatInput(e) {
    e.preventDefault();
    dispatch({ type: "setMessage", value: e.target.value });
  }

  function appendNewChat(message) {
    let chatsObj = {
      chatText: message,
      senderId: localStorage.getItem("userId"),
      senderName: localStorage.getItem("username"),
      dateTime: formatAMPM(new Date()),
    };

    setUserChats((draft) => {
      draft.push(chatsObj);
    });
    clearRef.current.value = "";
    dispatch({ type: "setMessage", value: "" });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (state.message === "") {
      return;
    }

    // submitRef.current.disabled = true;

    // setInterval(() => {
    //   submitRef.current.disabled = false;
    // }, 500);

    async function saveNewChat() {
      appendNewChat(state.message);

      try {
        props.socket.emit(
          "chat from browser",
          state.message,
          state.openedChat._id,
          localStorage.getItem("username")
        );

        const chats = await Axios.post(
          "http://localhost:4000/send-chat",
          {
            token: localStorage.getItem("jwt"),
            groupId: state.openedChat._id,
            message: state.message,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }

    saveNewChat();
  }

  function handleLogout(e) {
    localStorage.clear();
    dispatch({ type: "setLoggedOut" });
  }

  function handleAddUser(e, user) {
    e.preventDefault();
    let userId = user._id;

    try {
      async function addUserToGroup() {
        await Axios.post("http://localhost:4000/assign-usertogroup", {
          token: localStorage.getItem("jwt"),
          userId,
          groupId: state.openedChat._id,
        });

        console.log("userId & groupId", userId, state.openedChat._id);
      }

      addUserToGroup();

      //notify user about new group
      props.socket.emit("user_addedtogroup", {
        userId,
      });

      props.socket.emit("notify_user", {
        userId,
        groupId: state.openedChat._id,
      });

      setShowUserList(false);

      state.toast("User added to the group");
    } catch (error) {
      console.log(error);
    }
  }

  function handleShowUser(e) {
    async function getAllAvailableUsers() {
      if (!state.openedChat._id) {
        state.toast("Choose a group to add user.");
        return;
      }

      try {
        const availableUser = await Axios.post(
          "http://localhost:4000/get-allnongroupusers",
          {
            token: localStorage.getItem("jwt"),
            groupId: state.openedChat._id,
          }
        );

        setUserList(availableUser?.data?.nonGroupUsers);
        setShowUserList((prev) => !prev);
      } catch (error) {
        console.log(error);
      }
    }

    getAllAvailableUsers();
  }

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  return (
    <div>
      <div className={styles.chatPanel}>
        <div className={styles.userBar}>
          <div className={styles.userImgContainer}>
            <img src={props.userAvatar || avatar} alt="user" />
          </div>
          <div className={styles.userInfo}>
            <span style={{ fontSize: "17px", padding: 0, display: "block" }}>
              {state.openedChat.name}
            </span>
            <small style={{ fontSize: "12px", color: "#afacac" }}>
              {props.onlineStatus || "Last seen at"}
            </small>
          </div>

          <div onClick={handleLogout} className={styles.threeDots}>
            Logout
          </div>

          <div onClick={handleShowUser} className={styles.threeDots}>
            {showUserList ? "Close" : "Add User"}
          </div>
        </div>

        <div
          style={
            showUserList
              ? {
                  opacity: 1,
                  zIndex: 100,
                  visibility: "visible",
                  transition: "all 0.125s ease-out",
                }
              : { opacity: 0, visibility: "hidden" }
          }
          className={styles.userAddModal}
        >
          {userList.map((el) => {
            return (
              <form
                onSubmit={(e) => handleAddUser(e, el)}
                key={el._id}
                className={styles.users}
              >
                <div>
                  <span>{el.username}</span>
                  <small>{el.email}</small>
                </div>
                <input type="submit" name="submit" value="add user" />
              </form>
            );
          })}
        </div>

        <div
          onScroll={onScroll}
          ref={listInnerRef}
          className={styles.chatSection}
        >
          {/* <div ref={topRef}></div> */}

          {state.isLoading ? (
            <>
              <h3>Loading...</h3>
            </>
          ) : (
            <>
              {userChats.map((el) => {
                return (
                  <div
                    key={Math.random() * 10000000}
                    className={styles.chatBubbleContainer}
                  >
                    <div
                      className={
                        el.senderId === localStorage.getItem("userId")
                          ? styles.userChatBubble
                          : styles.chatBubble
                      }
                    >
                      <p style={{ margin: "0.4rem 0" }}>{el.chatText}</p>

                      <small style={{ fontSize: "0.7rem", display: "block" }}>
                        sent by{" "}
                        {el.senderId === localStorage.getItem("userId")
                          ? "Me"
                          : el.senderName}
                        <span
                          style={{ margin: "0.2rem", marginLeft: "0.7rem" }}
                        >
                          at {el.dateTime}
                        </span>{" "}
                      </small>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          <div style={{ height: "1px", width: "1px" }} ref={bottomRef}></div>
        </div>

        <form onSubmit={handleSubmit} action="#">
          <Input
            inputRef={clearRef}
            handleOnChange={handleChatInput}
            className={styles.chatInput}
          />
          <input
            ref={submitRef}
            className={styles.sendBtn}
            type="submit"
            value="send"
          />
        </form>
      </div>
    </div>
  );
}

export default Chat;
