import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TravellerSignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/traveller/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          throw new Error(data.errors.map(e => e.message).join(", "));
        }
        throw new Error(data.error || "Registration failed");
      }

      navigate("/user/complete-profile", {
        state: { userId: data.userId },
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
      <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
      <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />

      {error && <ErrorBox text={error} />}

      <SubmitButton loading={isLoading} text="Create Traveller Account" />
      <p className="text-center text-sm text-gray-300 mt-6">
         You have an account?{" "}
          <a href="/login" className="text-emerald-600 font-medium">
            Log in
          </a>
        </p>
    </form>
  );
};

export default TravellerSignupForm;

/* helpers */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm text-gray-300 mb-1">{label}</label>
    <input
      {...props}
      required
      className="w-full px-4 py-3 rounded-xl bg-white/20 text-white focus:ring-2 focus:ring-emerald-500"
    />
  </div>
);

const ErrorBox = ({ text }) => (
  <div className="bg-red-500/20 border border-red-500 text-red-400 px-3 py-2 rounded-lg text-sm">
    {text}
  </div>
);

const SubmitButton = ({ loading, text }) => (
  <button
    disabled={loading}
    className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl text-white font-semibold disabled:opacity-60"
  >
    {loading ? "Creating..." : text}
  </button>
);
