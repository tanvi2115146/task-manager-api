// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../../services/AuthService";
// import { jwtDecode } from "jwt-decode"; 
// import "./Login.css";  

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await loginUser({ email, password });
//       const token = response.data.token;

//       // Store token in localStorage
//       localStorage.setItem("token", token);

//       // Decode token to check role
//       const decoded = jwtDecode(token);

//       alert("Login successful");

//       // Redirect to dashboard after successful login
//       navigate("/dashboard");

//     } catch (error) {
//       setError(error.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <h2 className="login-title">Login</h2>
//         {error && <p className="login-error">{error}</p>}
//         <form onSubmit={handleLogin} className="login-form">
//           <input 
//             type="email" 
//             placeholder="Email" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)} 
//             required 
//             className="login-input"
//           />
//           <input 
//             type="password" 
//             placeholder="Password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             required 
//             className="login-input"
//           />
//           <button type="submit" className="login-button">
//             Login
//           </button>
//         </form>
//         <button 
//           onClick={() => navigate("/forgot-password")} 
//           className="login-forgot-password"
//         >
//           Forgot Password?
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Login;



















import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/AuthService";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";  

function Login() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await loginUser(values);
        const token = response.data.token;

        // Store token in localStorage
        localStorage.setItem("token", token);

        // Decode token to check role
        jwtDecode(token);

        toast.success("Login successful!");

        // Redirect to dashboard after successful login
        navigate("/dashboard");
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={formik.handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            {...formik.getFieldProps("email")}
            className="login-input"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="login-error">{formik.errors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...formik.getFieldProps("password")}
            className="login-input"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="login-error">{formik.errors.password}</p>
          )}

          <button type="submit" className="login-button" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <button onClick={() => navigate("/forgot-password")} className="login-forgot-password">
          Forgot Password?
        </button>
      </div>
    </div>
  );
}

export default Login;
