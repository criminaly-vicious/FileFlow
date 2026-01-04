import React from "react";
import ReactDOM from "react-dom/client"; // Note the '/client' import
import App from "./components/App";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}