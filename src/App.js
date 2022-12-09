import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

//
import "./App.css";
import Chat from "./Components/Chat";
import Listing from "./Components/Listing";
import Login from "./Components/Login";
import Register from "./Components/Register";
const socket = io("http://localhost:4000/");

function App() {
  const initState = {
    loggedIn: localStorage.getItem("jwt") ? true : false,
    connectedUser: [],
    chats: [],
    openedChat: {},
    currentUser: "",
    isLoading: true,
    lastMessage: "",
    message: "",
    toast,
    Swal,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case "setLoggedIn":
        draft.loggedIn = true;
        break;
      case "setLoggedOut":
        draft.loggedIn = false;
        break;
      case "setConnectedUsers":
        draft.connectedUser = action.value;
        break;
      case "appendANewGroup":
        draft.connectedUser.push(action.value);
        break;
      case "setOpenedChat":
        draft.openedChat = action.value;
        break;
      case "setChats":
        draft.chats = action.value;
        break;
      case "setCurrentUser":
        draft.currentUser = action.value;
        break;
      case "setIsLoading":
        draft.isLoading = action.value;
        break;
      case "setMessage":
        draft.message = action.value;
        break;
      case "appendNewChat":
        draft.chats.push(action.value);
        break;
      case "setLastMessage":
        draft.lastMessage = action.value;
        break;

      default:
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initState);

  state.loggedIn
    ? socket.emit("join", { userId: localStorage.getItem("userId") })
    : console.log("not logged in");

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <div className="App">
            <ToastContainer />
            <Routes>
              <Route
                path="/"
                element={
                  state.loggedIn ? (
                    <>
                      <Listing socket={socket} />
                      <Chat socket={socket} />
                    </>
                  ) : (
                    <Login />
                  )
                }
              />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
