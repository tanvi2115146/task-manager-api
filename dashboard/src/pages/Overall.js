
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar"; 
import "./Overall.css"; 

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
      setIsAuthenticated(true);

      axios
        .get("http://localhost:3000/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const allTasks = response.data.tasks;
          if (!Array.isArray(allTasks)) {
            console.error("Unexpected response format:", response.data);
            return;
          }
          setTasks(allTasks);
        }) 
        .catch((error) => {
          console.error("Error fetching tasks:", error);
        });
    } catch (error) {
      console.error("Invalid token:", error);
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (role) => {
    navigate(`/login?role=${role}`);
  };

  // DELETE TASK FUNCTION
  const handleDelete = async (taskId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state after deletion
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div>
      <Navbar /> 
      <div className="dashboard-container">
        {!isAuthenticated ? (
          <div className="login-selection">
            <h2>Select Login Type</h2>
            <div className="button-container">
              <button onClick={() => handleLogin("admin")} className="login-button">
                Login as Admin
              </button>
              <button onClick={() => handleLogin("user")} className="login-button">
                Login as User
              </button>
            </div>
          </div>
        ) : (
          <div className="dashboard-card">
            <h2 className="dashboard-title">Dashboard ({userRole})</h2>

            <h3>All Users Tasks</h3>
            {tasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>User ID</th> {/* New Column */}
                    <th>Username</th> {/* New Column */}
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th> 
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.id}</td>
                      <td>{task.user_id}</td> 
                      <td>{task.username}</td> 
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>{task.status}</td>
                      <td className="action-buttons">
                        {userRole === "admin" ? (
                          <>
                            <Link to={`/update-task/${task.id}`}>
                              <button className="edit-button">Update</button>
                            </Link>
                            <button 
                              className="delete-button" 
                              onClick={() => handleDelete(task.id)}
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <Link to={`/update-status/${task.id}`}>
                            <button className="edit-button">Update Status</button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;























// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import Navbar from "./Navbar";
// import "./Overall.css";

// function Dashboard() {
//   const [tasks, setTasks] = useState([]);
//   const [userRole, setUserRole] = useState("");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [currentTask, setCurrentTask] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setIsAuthenticated(false);
//       return;
//     }

//     try {
//       const decoded = jwtDecode(token);
//       setUserRole(decoded.role);
//       setIsAuthenticated(true);

//       axios
//         .get("http://localhost:3000/tasks", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           const allTasks = response.data.tasks;
//           if (!Array.isArray(allTasks)) {
//             console.error("Unexpected response format:", response.data);
//             return;
//           }
//           setTasks(allTasks);
//         })
//         .catch((error) => {
//           console.error("Error fetching tasks:", error);
//         });
//     } catch (error) {
//       console.error("Invalid token:", error);
//       setIsAuthenticated(false);
//     }
//   }, []);

//   const handleLogin = (role) => {
//     navigate(`/login?role=${role}`);
//   };

//   const openModal = (task = null) => {
//     setCurrentTask(task);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setCurrentTask(null);
//   };

//   return (
//     <div className={showModal ? "blur-background" : ""}>
//       <Navbar />
//       <div className="dashboard-container">
//         {!isAuthenticated ? (
//           <div className="login-selection">
//             <h2>Select Login Type</h2>
//             <div className="button-container">
//               <button onClick={() => handleLogin("admin")} className="login-button">
//                 Login as Admin
//               </button>
//               <button onClick={() => handleLogin("user")} className="login-button">
//                 Login as User
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="dashboard-card">
//             <h2 className="dashboard-title">Dashboard ({userRole})</h2>
//             {userRole === "admin" && (
//               <button className="add-task-button" onClick={() => openModal()}>Add Task</button>
//             )}
//             <h3>All Users Tasks</h3>
//             {tasks.length === 0 ? (
//               <p>No tasks found</p>
//             ) : (
//               <table className="task-table">
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>User</th>
//                     <th>Title</th>
//                     <th>Description</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tasks.map((task) => (
//                     <tr key={task.id}>
//                       <td>{task.id}</td>
//                       <td>{task.username}</td>
//                       <td>{task.title}</td>
//                       <td>{task.description}</td>
//                       <td>{task.status}</td>
//                       <td>
//                         {userRole === "admin" ? (
//                           <button className="edit-button" onClick={() => openModal(task)}>Update</button>
//                         ) : (
//                           <button className="edit-button">Update Status</button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {showModal && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <h2>{currentTask ? "Update Task" : "Add Task"}</h2>
//               <input type="text" placeholder="Title" defaultValue={currentTask?.title || ""} />
//               <textarea placeholder="Description" defaultValue={currentTask?.description || ""}></textarea>
//               <button onClick={closeModal}>Cancel</button>
//               <button className="save-button">Save</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;













