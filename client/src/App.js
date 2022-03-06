import "./App.css";
import SignUp from "./pages/SignUp";
import Login from "./components/Login";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainDashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(false);

  return (
    <div className="wrapper">
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Login data={user} setData={setUser} />}
          ></Route>

          <Route
            path="/signup"
            element={<SignUp data={user} setData={setUser} />}
          ></Route>

          <Route
            path="/dashboard"
            element={<MainDashboard data={user} setData={setUser} />}
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}
