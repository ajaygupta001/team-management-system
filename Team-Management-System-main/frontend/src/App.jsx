import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import PrivateRoute from "./ErrorBoundaries/PrivateRoute";
import NotFound from "./components/NotFound";
import AdminDashboard from "./components/AdminDashboard";
import MemberDashboard from "./components/MemberDashboard";
import TeamManagement from "./components/TeamManagement";
import ProjectManagement from "./components/ProjectManagement.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Private Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/member"
          element={
            <PrivateRoute allowedRoles={["Member"]}>
              <MemberDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <TeamManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <ProjectManagement />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
