import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; 

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUser(decodedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };


  return (
    <nav className="navbar">
      <h2 className="navbar-title">Task Manager</h2>
      <ul className="nav-links">
        {!user ? (
          <>
            <li>
              <Link to="/register" className="nav-link">Register</Link>
            </li>
            <li>
              <Link to="/login" className="nav-link">Login</Link>
            </li>
          </>
        ) : (
          <>
            {user.role === "admin" && (
              <>
                <li>
                <Link to="/users"> 
                  <button className="view-button">View All Users</button>
                </Link>
                </li>
                <li>
                <Link to="/add-task">  
                  <button  className="view-button">Add Task</button>
                </Link>
                </li>
                
              </>
            )}
            <li>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
