import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateTask.css"; 

const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ title: "", description: "", status: "pending" });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:3000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTask(response.data.task);
      })
      .catch((error) => {
        console.error("Error fetching task:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .put(
        `http://localhost:3000/tasks/${id}`,
        task,
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Task updated successfully!");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  return (
    <div className="update-task-container">
      <h2>Update Task</h2>
      <form onSubmit={handleSubmit} className="update-task-form">
        <label>Title:</label>
        <input type="text" name="title" value={task.title} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={task.description} onChange={handleChange} required></textarea>

        <label>Status:</label>
        <select name="status" value={task.status} onChange={handleChange} required>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <button type="submit" className="update-button">Update Task</button>
      </form>
    </div>
  );
};

export default UpdateTask;
