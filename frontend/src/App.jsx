import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Flags from "./pages/Flags";
import Environments from "./pages/Environments";
import AuditLogs from "./pages/AuditLogs";
import FlagDetail from "./pages/FlagDetail";
import EditFlag from "./pages/EditFlag";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/flags" element={<Flags />} />

      <Route path="/flags/:flagKey" element={<FlagDetail />} />

      <Route
        path="/flags/edit/:flagKey"
        element={<EditFlag />}
      />

      <Route
        path="/environments"
        element={<Environments />}
      />

      <Route
        path="/auditlogs"
        element={<AuditLogs />}
      />
    </Routes>
  );
}

export default App;