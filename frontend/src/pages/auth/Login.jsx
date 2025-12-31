import React, { useState, useEffect } from "react";
import backgroundImage from "/assets/background/2.jpg";
import backgroundImage2 from "/assets/background/3.jpg";
import backgroundImage3 from "/assets/background/4.jpg";
import { useNavigate } from "react-router-dom";
import logo from "/assets/images/main-logo.png";

const backgrounds = [backgroundImage, backgroundImage2, backgroundImage3];

const Login = () => {
  const [role, setRole] = useState("traveller"); // traveller | agency
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpoint =
      role === "traveller"
        ? "http://localhost:5000/api/auth/traveller/login"
        : "http://localhost:5000/api/auth/agency/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log('token is :', data.token);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("role", role);

      // Traveller redirect
      if (role === "traveller") {
        if (data.isProfileCompleted === 1) {
          navigate("/user/profile");
        } else {
          navigate("/user/complete-profile", { state: { userId: data.userId } });
        }
      }

      // Agency redirect
      if (role === "agency") {
        navigate("/agency/dashboard");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black/50" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        {/* Logo */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <img src={logo} className="w-28 h-28 rounded-full border-4 border-white/30" />
        </div>

        {/* Role Switch */}
        <div className="flex mt-14 mb-6 bg-white/10 rounded-xl p-1">
          <button
            onClick={() => setRole("traveller")}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              role === "traveller"
                ? "bg-emerald-600 text-white"
                : "text-gray-300"
            }`}
          >
            Traveller
          </button>
          <button
            onClick={() => setRole("agency")}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              role === "agency"
                ? "bg-emerald-600 text-white"
                : "text-gray-300"
            }`}
          >
            Agency
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />

          {error && <ErrorBox text={error} />}

          <button
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-3 rounded-xl text-white font-semibold disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : `Sign in as ${role}`}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-emerald-600 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

/* helpers */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm text-gray-300 mb-2">{label}</label>
    <input
      {...props}
      required
      className="w-full px-4 py-3 rounded-xl bg-white/20 text-white focus:ring-2 focus:ring-emerald-500"
    />
  </div>
);

const ErrorBox = ({ text }) => (
  <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
    {text}
  </div>
);
