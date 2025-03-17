

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTask.css";

const AddTask = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [users, setUsers] = useState([]); // Fetch users for assigning
    const [assignedUserId, setAssignedUserId] = useState(""); // Selected user ID
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    // Fetch users for dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:3000/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch users");

                const data = await response.json();
                setUsers(data.users);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!assignedUserId) {
            setError("Please select a user to assign this task.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, assignedUserId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create task");
            }

            setSuccess("Task assigned successfully!");
            setTitle("");
            setDescription("");
            setAssignedUserId("");

            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="add-task-container">
            <h2>Assign New Task</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <label>Assign To:</label>
                <select value={assignedUserId} onChange={(e) => setAssignedUserId(e.target.value)} required>
                    <option value="">-- Select a User --</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>

                <button type="submit" className="task-btn">Assign Task</button>
            </form>
        </div>
    );
};

export default AddTask;

