
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Register.css";  // Ensure it's imported

// function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("http://localhost:3000/register", {
//         name,
//         email,
//         password,
//       });

//       if (response.data) {
//         alert(response.data.message);
//         navigate("/login");
//       } else {
//         alert("Registration successful, but no response message.");
//       }
//     } catch (error) {
//       setError(error.response?.data?.error || "Something went wrong");
//     }
//   };

//   return (
//     <div className="register-container">
//       <div className="register-card">
//         <h2 className="register-title">Register</h2>
//         {error && <p className="register-error">{error}</p>}
//         <form onSubmit={handleSubmit} className="register-form">
//           <input
//             type="text"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             className="register-input"
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="register-input"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="register-input"
//           />
//           <button type="submit" className="register-button">
//             Register
//           </button>
//         </form>
//         <button onClick={() => navigate("/login")} className="register-login-link">
//           Already have an account? Login
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Register;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is "user"
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/register", {
        name,
        email,
        password,
        role, // Send selected role to backend
      });

      if (response.data) {
        alert(response.data.message);
        navigate("/login");
      } else {
        alert("Registration successful, but no response message.");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        {error && <p className="register-error">{error}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />
          
          {/* Role Selection Dropdown */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="register-input"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <button onClick={() => navigate("/login")} className="register-login-link">
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Register;


