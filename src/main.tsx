import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";        // <— no .tsx here
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
