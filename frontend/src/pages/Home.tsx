import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import "./Home.css";
import carImage from "../assets/carBack.png";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  
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
    </div>
  );
};

export default Home;
