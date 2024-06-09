import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./pages/Welcome.tsx";
import End from "./pages/End.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/game",
    element: <App />,
  },
  {
    path: "/end",
    element: <End />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
