import React from "react";
import { toast, ToastContainer } from "react-toastify";

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  MdOutlineAlternateEmail,
  MdPassword,
  MdVisibility,
  MdVisibilityOff,
  MdArrowForward,
  MdSecurity,
  MdSpeed,
  MdVerifiedUser,
} from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import "./Login.css";
import loginCar from "../assets/carBack.png";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    // Check for saved credentials
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const sheet = document.styleSheets[0];
    try {
      sheet.insertRule(
        `input:-webkit-autofill {
        box-shadow: 0 0 0 1000px rgb(0, 0, 0) inset !important;
        -webkit-text-fill-color: #eee !important;
      }`,
        sheet.cssRules.length
      );
    } catch (err) {
      console.warn("Autofill rule insert failed:", err);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      toast.success("Logged in with Google!");
      window.history.replaceState({}, document.title, "/dashboard");
      navigate("/dashboard");
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!form.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/login", form);
      localStorage.setItem("token", res.data.token);

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", form.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      toast.success("Login successful", { autoClose: 3000 });
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error: any) {
      setErrors({
        email: "",
        password:
          error.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    window.location.href = `http://localhost:8080/auth/${provider}`;
  };

  const features = [
    {
      icon: <MdSecurity />,
      title: "Secure Login",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: <MdSpeed />,
      title: "Quick Access",
      description: "Get instant access to your dashboard and bookings",
    },
    {
      icon: <MdVerifiedUser />,
      title: "Trusted Platform",
      description: "Join thousands of satisfied customers worldwide",
    },
  ];

  return (
    <div className="login-wrapper">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Left Section - Image and Features */}
      <div className="login-img-section">
        <div className="image-container">
          <img
            src={loginCar || "/placeholder.svg"}
            alt="Premium Car"
            className={`login-car-img ${isVisible ? "animate-in" : ""}`}
          />
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="login-form-section">
        <div className="form-container">
          <div className="form-header">
            <h2 className={isVisible ? "animate-in" : ""}>Welcome Back</h2>
            <p className={`subtitle ${isVisible ? "animate-in" : ""}`}>
              Login to rent your next car with ease
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`auth-form ${isVisible ? "animate-in" : ""}`}
          >
            {/* Social Login Buttons */}
            <div className="social-login">
              <button
                type="button"
                className="social-btn google"
                onClick={() => handleSocialLogin("google")}
              >
                <FaGoogle style={{ marginRight: 8 }} />
                <span>Continue with Google</span>
              </button>

              <div className="social-row"></div>
            </div>

            <div className="divider">
              <span>or continue with email</span>
            </div>

            {/* Email Input */}
            <div className="input-group">
              <MdOutlineAlternateEmail className="icon" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? "error" : ""}
                required
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* Password Input */}
            <div className="input-group">
              <MdPassword className="icon" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? "error" : ""}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`login-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <MdArrowForward />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <p className="bottom-note">
              New here?
              <Link to="/register" className="signup-link">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
