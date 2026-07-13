import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Flags from "./pages/Flags";
import FlagDetail from "./pages/FlagDetail";

function App() {
  const [environment, setEnvironment] = useState("Development");
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Sidebar />

      <div
        style={{
          marginLeft: "250px",
          minHeight: "100vh",
          background: "#f5f7fb",
        }}
      >
        <Navbar
          environment={environment}
          setEnvironment={setEnvironment}
          onCreateFlag={() => setShowForm(true)}
        />

        <div
          style={{
            padding: "70px 25px 25px",
          }}
        >
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
          </Routes>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="colored"
      />
    </>
  );
}

export default App;