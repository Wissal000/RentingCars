"use client";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  Star,
  ChevronDown,
  Play,
  CheckCircle,
} from "lucide-react";
import "./Home.css";
import carImage from "../assets/carBack.png";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Shield className="feature-icon" />,
      title: "Secure & Safe",
      description: "Advanced security features to protect your journey",
    },
    {
      icon: <Zap className="feature-icon" />,
      title: "Lightning Fast",
      description: "Quick booking and instant confirmations",
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Community Driven",
      description: "Join thousands of satisfied customers",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Executive",
      content:
        "Amazing service! The booking process was seamless and the car was perfect.",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Travel Enthusiast",
      content: "Best car rental experience I've ever had. Highly recommended!",
      rating: 5,
    },
    {
      name: "Emma Davis",
      role: "Frequent Traveler",
      content:
        "Professional service and great value. Will definitely use again.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "1000+", label: "Cars Available" },
    { number: "24/7", label: "Support" },
    { number: "99%", label: "Satisfaction Rate" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="home-container">
          {/* Left half with image */}
          <div className="home-left">
            <div className="image-container">
              <img
                src={carImage || "/placeholder.svg"}
                alt="Premium Car"
                className={`car-img ${isVisible ? "animate-in" : ""}`}
              />
              <div className="image-overlay">
                <div className="play-button">
                  <Play size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Right half with content */}
          <div className="home-right">
            <div className="hero-content">
              <div className="hero-badge">
                <span>🚗 Premium Car Rental</span>
              </div>

              <h1 className={`hero-title ${isVisible ? "animate-in" : ""}`}>
                Drive into the
                <span className="gradient-text"> Future</span>
              </h1>

              <p
                className={`hero-description ${isVisible ? "animate-in" : ""}`}
              >
                Experience luxury and convenience with our premium car rental
                service. Sign in or create an account to unlock exclusive deals
                and seamless booking.
              </p>

              <div className={`cta-buttons ${isVisible ? "animate-in" : ""}`}>
                <Link to="/login" className="btn-link">
                  <button className="btn btn-primary">
                    Get Started
                    <ArrowRight size={20} />
                  </button>
                </Link>

                <Link to="/register" className="btn-link">
                  <button className="btn btn-secondary">Create Account</button>
                </Link>
              </div>
            </div>

            <button className="scroll-indicator" onClick={scrollToFeatures}>
              <ChevronDown size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Us</h2>
            <p>Discover what makes our service exceptional</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real experiences from real customers</p>
          </div>

          <div className="testimonial-container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star key={i} size={20} fill="currentColor" />
                    )
                  )}
                </div>
                <blockquote>
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="testimonial-author">
                  <div className="author-info">
                    <div className="author-name">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="author-role">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${
                    index === currentTestimonial ? "active" : ""
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>
              Join thousands of satisfied customers and experience the
              difference
            </p>

            <div className="cta-features">
              <div className="cta-feature">
                <CheckCircle size={20} />
                <span>Instant Booking</span>
              </div>
              <div className="cta-feature">
                <CheckCircle size={20} />
                <span>24/7 Support</span>
              </div>
              <div className="cta-feature">
                <CheckCircle size={20} />
                <span>Best Prices</span>
              </div>
            </div>

            <div className="cta-buttons">
              <Link to="/register" className="btn-link">
                <button className="btn btn-primary btn-large">
                  Get Started Now
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
