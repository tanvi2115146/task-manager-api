import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  // Formik setup with Yup validation
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:3000/register", values);

        if (response.data) {
          toast.success("Registration Successful!"); // Show success toast
          navigate("/login");
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "User already exists!"); // Show error toast
      }
    },
  });

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        <form onSubmit={formik.handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Name"
            {...formik.getFieldProps("name")}
            className="register-input"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="register-error">{formik.errors.name}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            {...formik.getFieldProps("email")}
            className="register-input"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="register-error">{formik.errors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...formik.getFieldProps("password")}
            className="register-input"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="register-error">{formik.errors.password}</p>
          )}

          <select {...formik.getFieldProps("role")} className="register-input">
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

