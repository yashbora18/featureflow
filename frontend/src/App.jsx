import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";


// =====================================================
// AUTHENTICATION
// =====================================================

import Auth from "./components/auth/Auth";


// =====================================================
// LAYOUT
// =====================================================

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";


// =====================================================
// PAGES
// =====================================================

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Flags from "./pages/Flags";
import FlagDetail from "./pages/FlagDetail";
import Environments from "./pages/Environments";
import Team from "./pages/Team";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";

// =====================================================
// APP
// =====================================================

function App() {

  const [environment, setEnvironment] =
    useState("Development");


  const [showForm, setShowForm] =
    useState(false);


  // MOBILE SIDEBAR
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);


  const location = useLocation();


  // DARK MODE
  const [darkMode, setDarkMode] = useState(
    () =>
      localStorage.getItem("theme") === "dark"
  );


  // =====================================================
  // DARK MODE
  // =====================================================

  useEffect(() => {

    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

  }, [darkMode]);


  // =====================================================
  // CLOSE SIDEBAR AFTER NAVIGATION
  // =====================================================

  useEffect(() => {

    setIsSidebarOpen(false);

  }, [location.pathname]);


  // =====================================================
  // PUBLIC PAGES
  // =====================================================

  const isPublicPage =
  location.pathname === "/" ||
  location.pathname === "/auth" ||
  location.pathname === "/forgot-password";


  if (isPublicPage) {

    return (

      <Routes>

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/auth"
          element={<Auth />}
        />

        <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      </Routes>

    );

  }


  // =====================================================
  // APPLICATION
  // =====================================================

  return (

    <div
      className={
        darkMode
          ? "app dark-theme"
          : "app"
      }
    >


      {/* =================================================
          SIDEBAR
          IMPORTANT:
          Sidebar is OUTSIDE main-layout
      ================================================= */}

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />


      {/* =================================================
          MAIN LAYOUT
      ================================================= */}

      <div className="main-layout">


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="content-area">


          {/* =================================================
              NAVBAR
          ================================================= */}

          <Navbar

            environment={environment}

            setEnvironment={setEnvironment}

            darkMode={darkMode}

            setDarkMode={setDarkMode}

            isOpen={isSidebarOpen}

            setIsOpen={setIsSidebarOpen}

          />


          {/* =================================================
              PAGE CONTENT
          ================================================= */}

          <main className="page-content">

            <Routes>


              {/* DASHBOARD */}

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard
                      environment={environment}
                    />
                  </ProtectedRoute>
                }
              />


              {/* ANALYTICS */}

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics
                      environment={environment}
                    />
                  </ProtectedRoute>
                }
              />


              {/* FLAGS */}

              <Route
                path="/flags"
                element={
                  <ProtectedRoute>
                    <Flags
                      environment={environment}
                      showForm={showForm}
                      setShowForm={setShowForm}
                    />
                  </ProtectedRoute>
                }
              />


              {/* FLAG DETAIL */}

              <Route
                path="/flag/:id/:environmentId"
                element={
                  <ProtectedRoute>
                    <FlagDetail />
                  </ProtectedRoute>
                }
              />


              {/* ENVIRONMENTS */}

              <Route
                path="/environments"
                element={
                  <ProtectedRoute>
                    <Environments />
                  </ProtectedRoute>
                }
              />


              {/* TEAM */}

              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <Team />
                  </ProtectedRoute>
                }
              />


              {/* AUDIT LOGS */}

              <Route
                path="/audit-logs"
                element={
                  <ProtectedRoute>
                    <AuditLogs
                      environment={environment}
                    />
                  </ProtectedRoute>
                }
              />


              {/* SETTINGS */}

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* PROFILE */}

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

            </Routes>

          </main>

        </div>

      </div>

    </div>

  );

}


export default App;