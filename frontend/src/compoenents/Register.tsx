import React from "react";
import { toast, ToastContainer } from "react-toastify";

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiZap,
  FiUsers,
  FiCheck,
} from "react-icons/fi";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import "./Register.css";
import BackImg from "../assets/carBack.png";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!form.username) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

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
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Calculate password strength
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !acceptTerms) {
      if (!acceptTerms) {
        toast.warn("Please accept the terms and conditions", {
          autoClose: 3000,
        });
      }
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("http://localhost:8080/api/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      toast.success("Sign Up successfully", { autoClose: 3000 });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      setErrors({
        username: "",
        email: "",
        password: "",
        confirmPassword:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
        { autoClose: 3000 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider}`);
    // Implement social registration logic here
  };

  const features = [
    {
      icon: <FiShield />,
      title: "Secure & Protected",
      description: "Your personal data is encrypted and secure",
    },
    {
      icon: <FiZap />,
      title: "Quick Setup",
      description: "Get started in less than 2 minutes",
    },
    {
      icon: <FiUsers />,
      title: "Join Community",
      description: "Connect with thousands of car enthusiasts",
    },
  ];

  const benefits = [
    "Access to premium car rentals",
    "24/7 customer support",
    "Exclusive member discounts",
    "Priority booking system",
    "Mobile app access",
  ];

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
      case 3:
        return "Medium";
      case 4:
      case 5:
        return "Strong";
      default:
        return "";
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "#ef4444";
      case 2:
      case 3:
        return "#f59e0b";
      case 4:
      case 5:
        return "#10b981";
      default:
        return "#e5e7eb";
    }
  };

  return (
    <div className="register-wrapper">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Left Section - Image and Features */}
      <div className="register-img-section">
        <div className="image-container">
          <img
            src={BackImg || "/placeholder.svg"}
            alt="Premium Car"
            className={`register-car-img ${isVisible ? "animate-in" : ""}`}
          />
        </div>

        {/* Benefits List */}
        <div className="benefits-list">
          <h4>What you'll get:</h4>
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <FiCheck className="check-icon" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Registration Form */}
      <div className="register-form-section">
        <div className="form-container">
          <div className="form-header">
            <h2 className={isVisible ? "animate-in" : ""}>Create Account</h2>
            <p className={`subtitle ${isVisible ? "animate-in" : ""}`}>
              Join thousands of satisfied customers
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`register-form ${isVisible ? "animate-in" : ""}`}
          >
            {/* Social Registration Buttons */}
            <div className="social-register">
              <button
                type="button"
                className="social-btn google"
                onClick={() => handleSocialRegister("google")}
              >
                <FaGoogle />
                <span>Continue with Google</span>
              </button>
              <div className="social-row">
                <button
                  type="button"
                  className="social-btn facebook"
                  onClick={() => handleSocialRegister("facebook")}
                >
                  <FaFacebook />
                </button>
                <button
                  type="button"
                  className="social-btn apple"
                  onClick={() => handleSocialRegister("apple")}
                >
                  <FaApple />
                </button>
              </div>
            </div>

            <div className="divider">
              <span>or register with email</span>
            </div>

            {/* Username Input */}
            <div className="input-group">
              <FiUser className="icon" />
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className={errors.username ? "error" : ""}
                required
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>

            {/* Email Input */}
            <div className="input-group">
              <FiMail className="icon" />
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
              <FiLock className="icon" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={errors.password ? "error" : ""}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(),
                      }}
                    />
                  </div>
                  <span
                    className="strength-text"
                    style={{ color: getPasswordStrengthColor() }}
                  >
                    {getPasswordStrengthText()}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="input-group">
              <FiLock className="icon" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? "error" : ""}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="terms-container">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span className="checkmark"></span>I agree to the{" "}
                <Link to="/terms" className="terms-link">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="terms-link">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className={`register-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight />
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="bottom-note">
              Already have an account?
              <Link to="/login" className="login-link">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
