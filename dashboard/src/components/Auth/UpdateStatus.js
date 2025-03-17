import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateStatus.css"; 

function UpdateStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setStatus(response.data.task.status);
      })
      .catch((error) => {
        console.error("Error fetching task:", error);
      });
  }, [id]);

  const handleUpdate = () => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `http://localhost:3000/tasks/${id}`,
        { status }, // Only status is being updated
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Status updated successfully!");
        navigate("/dashboard"); // Redirect back to the dashboard
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  return (
    <div className="update-status-container">
      <h2>Update Task Status</h2>
      <label>
        Status:
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="status-dropdown">
          <option value="Pending">Pending</option>
          <option value="Complete">Complete</option>
        </select>
      </label>
      <button onClick={handleUpdate} className="update-button">Update Status</button>
    </div>
  );
}

export default UpdateStatus;
