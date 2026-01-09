import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/index.jsx";
import { AboutProvider } from "./context/AboutContext.jsx";
import { ContentProvider } from "./context/ContentContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";


createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ContentProvider>
      <AboutProvider>
        <RouterProvider router={router} />
      </AboutProvider>
    </ContentProvider>
  </AuthProvider>
);
