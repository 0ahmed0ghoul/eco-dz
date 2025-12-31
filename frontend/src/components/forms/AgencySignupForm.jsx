import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AgencySignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password : "",
    phone: "",
    website: "",
    address: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const Navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/agency/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // express-validator errors
        if (data.errors) {
          throw new Error(data.errors.map(e => e.message).join(", "));
        }
        throw new Error(data.error || "Agency registration failed");
      }

      setSuccess("Agency registered successfully. Waiting for admin approval.");
      setFormData({
        name: "",
        email: "",
        password : "",
        phone: "",
        website: "",
        address: "",
        description: "",
      });
      setTimeout(() => {
        Navigate("/");

      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Agency Name" name="name" value={formData.name} onChange={handleChange} />
      <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
      <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
      <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
      <Input label="Website" name="website" value={formData.website} onChange={handleChange} />
      <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
      <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} />

      {error && <ErrorBox text={error} />}
      {success && <SuccessBox text={success} />}

      <button
        disabled={isLoading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl text-white font-semibold disabled:opacity-60"
      >
        {isLoading ? "Submitting..." : "Register Agency (Pending Approval)"}
      </button>
      <p className="text-center text-sm text-gray-300 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-emerald-600 font-medium">
            Sign up
          </a>
        </p>
    </form>
  );
};

export default AgencySignupForm;

/* helpers */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm text-gray-300 mb-1">{label}</label>
    <input
      {...props}
      required={props.name === "name" || props.name === "email"}
      className="w-full px-4 py-3 rounded-xl bg-white/20 text-white"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm text-gray-300 mb-1">{label}</label>
    <textarea
      {...props}
      rows="3"
      className="w-full px-4 py-3 rounded-xl bg-white/20 text-white"
    />
  </div>
);

const ErrorBox = ({ text }) => (
  <div className="bg-red-500/20 border border-red-500 text-red-400 px-3 py-2 rounded-lg text-sm">
    {text}
  </div>
);

const SuccessBox = ({ text }) => (
  <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 px-3 py-2 rounded-lg text-sm">
    {text}
  </div>
);
