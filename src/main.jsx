import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles.css";

import { RoleProvider } from "./context/RoleContext";
import { JobProvider } from "./context/JobContext";
import { WalletProvider } from "./context/WalletContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RoleProvider>
      <JobProvider>
        <WalletProvider>
          <App />
        </WalletProvider>
      </JobProvider>
    </RoleProvider>
  </React.StrictMode>
);