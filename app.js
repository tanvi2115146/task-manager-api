const express = require("express");
const {con,jwtSecret} = require('./database')// Import database connection
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const app = express();
app.use(bodyParser.json());
const port = 3000;




//user register

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Check if user exists
      const userExists = await con.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert user
      const newUser = await con.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, hashedPassword]
      );
  
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

  



// // routes for crud operations  


//create
app.post("/tasks", authenticate, async (req, res) => {
    const { title, description } = req.body;
  
    try {
      const newTask = await con.query(
        "INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
        [title, description, req.user.id]
      );
  
      res.status(201).json({ message: "Task created", task: newTask.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


//get all tasks

  app.get("/tasks", authenticate, async (req, res) => {
    try {
      const tasks = await con.query(
        "SELECT * FROM tasks WHERE user_id = $1",
        [req.user.id]
      );
  
      res.status(200).json({ tasks: tasks.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  //update
  app.put("/tasks/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
  
    try {
      const updatedTask = await con.query(
        "UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
        [title, description, status, id, req.user.id]
      );
  
      if (updatedTask.rows.length === 0) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.status(200).json({ message: "Task updated", task: updatedTask.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  //delete
  app.delete("/tasks/:id", authenticate, async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedTask = await con.query(
        "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
        [id, req.user.id]
      );
  
      if (deletedTask.rows.length === 0) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.status(200).json({ message: "Task deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


  


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });