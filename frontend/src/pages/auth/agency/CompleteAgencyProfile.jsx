import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CompleteProfile = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(null);
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /* 🔐 Protect page */
  useEffect(() => {
    if (!token || role !== "agency") {
      navigate("/login");
    }
  }, [token, role, navigate]);

  /* 📥 Fetch existing agency profile */
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/agency/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log(data.agency);
        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");

        setCompanyName(data.agency.name || "");
        setEmail(data.agency.email || "");
        setPhone(data.agency.phone || null);
        setWebsite(data.agency.website || "");
        setDescription(data.agency.description || "");

        if (data.logo) {
          setPreview(`http://localhost:5000/${data.logo}`);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchProfile();
  }, [token]);

  /* 🖼 Logo handlers */
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!companyName) {
      setError("Company name is required");
      return;
    }
  
    setIsLoading(true);
    setError("");
  
    try {
      const formData = new FormData();
      formData.append("username", companyName);
      formData.append("phone", phone);
      formData.append("website", website);
      formData.append("description", description);
      // optional
      formData.append("address", "");
  
      if (logo) formData.append("avatar", logo);
      console.log(logo);
      console.log(companyName);      
      console.log(phone);      
      console.log(website);
      const token = localStorage.getItem("authToken");
  
      const res = await fetch(
        "http://localhost:5000/api/auth/agency/complete-profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);
  
      navigate("/agency/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-12">
      <h2 className="text-2xl font-semibold mb-4">Complete Agency Profile</h2>

      <div className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Company Name *"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <input
          type="url"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <div>
          <label className="block mb-1 font-medium">Company Logo</label>

          {preview && (
            <div className="relative inline-block mb-2">
              <img
                src={preview}
                alt="Logo Preview"
                className="w-32 h-32 object-cover rounded"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                &times;
              </button>
            </div>
          )}

          <input type="file" accept="image/*" onChange={handleLogoChange} />
        </div>

        <button
          className={`mt-6 w-full bg-blue-600 text-white py-2 rounded ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default CompleteProfile;
