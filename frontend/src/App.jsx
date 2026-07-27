import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Flags from "./pages/Flags";
import FlagDetail from "./pages/FlagDetail";
import Environments from "./pages/Environments";

import "./App.css";

function App() {

  const [environment, setEnvironment] = useState("Development");
  const [showForm, setShowForm] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <>
      <div className={darkMode ? "app dark-theme" : "app"}>

        <Sidebar />

        <div className="main-layout">

          <Navbar
            environment={environment}
            setEnvironment={setEnvironment}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <main className="page-content">

            <Routes>

              <Route
                path="/"
                element={
                  <Flags
                    environment={environment}
                    showForm={showForm}
                    setShowForm={setShowForm}
                  />
                }
              />

              <Route
                path="/flag/:id"
                element={<FlagDetail />}
              />

              <Route
                path="/environments"
                element={<Environments />}
              />

            </Routes>

          </main>

        </div>

      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
    </>
  );
}

export default App;