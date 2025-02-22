const express = require("express");
const {con,jwtSecret,transporter} = require('./database')// Import database connection
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid"); 


const app = express();
app.use(bodyParser.json());
const port = 3000;



//user register

app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body; // Include role

  const userExists = await con.query("SELECT * FROM users WHERE email = $1", [email]);
  if (userExists.rows.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = await con.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, hashedPassword, role || 'user'] // Default to 'user'
  );
  try {
      res.status(201).json({ message: "User registered", user: newUser.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


 //login

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      const user = await con.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (user.rows.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Verify password
      const isMatch = await bcrypt.compare(password, user.rows[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Generate token
      const token = jwt.sign({ id: user.rows[0].id }, jwtSecret, {
        expiresIn: "1h",
      });
  
      res.status(200).json({ message: "Logged in successfully", token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


//jwt verify authentication
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // Attach the user info to `req.user`
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};



//admin middleware
const isAdmin = async (req, res, next) => {
  try {
      const user = await con.query("SELECT role FROM users WHERE id = $1", [req.user.id]);
      if (user.rows.length > 0 && user.rows[0].role === "admin") {
          next(); // Admin is allowed
      } else {
          res.status(403).json({ message: "Access denied. Admins only." });
      }
  } catch (error) {
      res.status(500).json({ error: "Error checking admin role" });
  }
};




// Step 3: Forgot Password API
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await con.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const token = uuidv4(); // Generate reset token

    await con.query("INSERT INTO reset_password (email, token) VALUES ($1, $2)", [email, token]);

    // Generate Reset Link
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    console.log(`Reset Link: ${resetLink}`); // Debugging

    // Send Email with Reset Link
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      text: `Click the following link to reset your password: ${resetLink}`,
    });

    res.json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    res.status(500).json({ error: error.message });
  }
});




// Step 4: Reset Password API
app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Check if token exists
    const result = await con.query("SELECT * FROM reset_password WHERE token = $1", [token]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const email = result.rows[0].email;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await con.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

    // Remove token from the reset_password table
    // await con.query("DELETE FROM reset_password WHERE token = $1", [token]);
    await con.query("UPDATE reset_password SET used = TRUE WHERE token = $1", [token]);


    res.json({ message: "Password has been reset successfully!" });
  } catch (error) {
    console.error("Error in reset-password:", error);
    res.status(500).json({ error: error.message });
  }
});




// routes for tasks 


//create task
app.post("/tasks", authenticate, async (req, res) => {
  const { title, description, assignedUserId } = req.body;

  try {
      // Check if the logged-in user is an admin
      const userRole = await con.query("SELECT role FROM users WHERE id = $1", [req.user.id]);
      if (userRole.rows[0].role !== "admin") {
          return res.status(403).json({ message: "Access denied. Only admins can create tasks." });
      }

      // Assign task to specified user or default to admin
      const userId = assignedUserId || req.user.id; 

      const newTask = await con.query(
          "INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
          [title, description, userId]
      );

      res.status(201).json({ message: "Task created successfully", task: newTask.rows[0] });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



//get all tasks

app.get("/tasks", authenticate, async (req, res) => {
  try {
      let tasks;

      const userRole = await con.query("SELECT role FROM users WHERE id = $1", [req.user.id]);
      if (userRole.rows[0].role === "admin") {
          // Admin sees all tasks
          tasks = await con.query("SELECT * FROM tasks");
      } else {
          // Users see only their tasks
          tasks = await con.query("SELECT * FROM tasks WHERE user_id = $1", [req.user.id]);
      }

      res.status(200).json({ tasks: tasks.rows });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



  //update
  app.put("/tasks/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const { status, title, description } = req.body;

    try {
        // Get the user's role
        const userRole = await con.query("SELECT role FROM users WHERE id = $1", [req.user.id]);
        const isAdmin = userRole.rows[0].role === "admin";

        if (isAdmin) {
            // Admin can update any task field (title, description, status)
            const updatedTask = await con.query(
                "UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *",
                [title, description, status, id]
            );

            if (updatedTask.rows.length === 0) {
                return res.status(404).json({ message: "Task not found" });
            }

            return res.status(200).json({ message: "Task updated", task: updatedTask.rows[0] });
        } else {
            // Regular users can ONLY update the status
            if (title || description) {
                return res.status(400).json({ message: "Only status can be managed by regular users." });
            }

            if (!status) {
                return res.status(400).json({ message: "Status is required to update." });
            }

            const updatedTask = await con.query(
                "UPDATE tasks SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
                [status, id, req.user.id]
            );

            if (updatedTask.rows.length === 0) {
                return res.status(404).json({ message: "Task not found or unauthorized update." });
            }

            return res.status(200).json({ message: "Task status updated", task: updatedTask.rows[0] });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


  
//delete
  app.delete("/tasks/:id", authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the logged-in user is an admin
        const userRole = await con.query("SELECT role FROM users WHERE id = $1", [req.user.id]);
        if (userRole.rows[0].role !== "admin") {
            return res.status(403).json({ message: "Access denied. Only admins can delete tasks." });
        }

        // Admin can delete any task
        const deletedTask = await con.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);

        if (deletedTask.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


  






app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });