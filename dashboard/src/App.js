import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Dashboard from "./pages/Overall";
import UserList from "./components/Auth/UserList";
import AddTask from "./components/Auth/AddTask";
import UpdateTask from "./components/Auth/UpdateTask";
import UpdateStatus from "./components/Auth/UpdateStatus";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/update-task/:id" element={<UpdateTask />} />
        <Route path="/update-status/:id" element={<UpdateStatus />} />
        

        
      </Routes>
    </Router>
  );
}

export default App;
