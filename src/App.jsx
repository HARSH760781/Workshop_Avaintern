import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Workshop from "./Workshop";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Workshop />
    </>
  );
}

export default App;
