import { useState } from "react";

//
import "./App.css";
import Chat from "./Components/Chat";
import Listing from "./Components/Listing";

function App() {
  const [showChat, setShowChat] = useState(["Click any user tile"]);
  const [user, setUser] = useState([]);

  return (
    <div className="App">
      <Listing setUser={setUser} setShowChat={setShowChat} />
      <Chat user={user} messages={showChat} />
    </div>
  );
}

export default App;
