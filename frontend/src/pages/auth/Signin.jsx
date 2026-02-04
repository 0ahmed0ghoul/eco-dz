import React, { useState, useEffect, useRef } from 'react';
import backgroundImage from "/assets/background/2.jpg";
import backgroundImage2 from "/assets/background/3.jpg";
import backgroundImage3 from "/assets/background/4.jpg";
import logo from '/assets/images/main-logo.png';
import { useNavigate } from 'react-router-dom';

// Add eye icons (you can also use an icon library like react-icons)
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const backgrounds = [backgroundImage, backgroundImage2, backgroundImage3];

// Validation patterns
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  website: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
  username: /^[a-zA-Z0-9_]{3,30}$/
};

// Validation messages
const validationMessages = {
  username: "Username must be 3-30 characters (letters, numbers, underscores only)",
  email: "Please enter a valid email address",
  password: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
  phone: "Please enter a valid phone number",
  website: "Please enter a valid website URL",
  address: "Address is required for agencies",
  description: "Description must be at least 10 characters for agencies"
};

// Field order for auto-focus
const fieldOrder = {
  traveller: ['username', 'email', 'password'],
  agency: ['username', 'email', 'password', 'phone', 'website', 'address', 'description']
};

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    website: "",
    address: "",
    description: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    website: "",
    address: "",
    description: "",
  });
  
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    phone: false,
    website: false,
    address: false,
    description: false,
  });
  
  const [role, setRole] = useState("traveller");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Refs for auto-focus
  const inputRefs = useRef({
    username: useRef(null),
    email: useRef(null),
    password: useRef(null),
    phone: useRef(null),
    website: useRef(null),
    address: useRef(null),
    description: useRef(null)
  });

  // Background slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Validation functions
  const validateField = (name, value, isTraveller = role === "traveller") => {
    let error = "";
    
    if (!value.trim()) {
      error = "This field is required";
    } else {
      switch(name) {
        case 'username':
          if (!patterns.username.test(value)) {
            error = validationMessages.username;
          }
          break;
        case 'email':
          if (!patterns.email.test(value)) {
            error = validationMessages.email;
          }
          break;
        case 'password':
          if (!patterns.password.test(value)) {
            error = validationMessages.password;
          }
          break;
        case 'phone':
          if (!isTraveller && !patterns.phone.test(value.replace(/\s/g, ''))) {
            error = validationMessages.phone;
          }
          break;
        case 'website':
          if (!isTraveller && !patterns.website.test(value)) {
            error = validationMessages.website;
          }
          break;
        case 'address':
          if (!isTraveller && value.trim().length < 5) {
            error = validationMessages.address;
          }
          break;
        case 'description':
          if (!isTraveller && value.trim().length < 10) {
            error = validationMessages.description;
          }
          break;
        default:
          break;
      }
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleKeyDown = (e, fieldName) => {
    // If Enter key is pressed and not in a textarea
    if (e.key === 'Enter' && fieldName !== 'description') {
      e.preventDefault(); // Prevent form submission
      
      // Get current field order based on role
      const currentFieldOrder = fieldOrder[role];
      const currentIndex = currentFieldOrder.indexOf(fieldName);
      
      // If there's a next field, focus on it
      if (currentIndex < currentFieldOrder.length - 1) {
        const nextField = currentFieldOrder[currentIndex + 1];
        inputRefs.current[nextField]?.current?.focus();
      }
      // If it's the last field and form is valid, submit
      else if (!hasErrors && formData.username && formData.email && formData.password) {
        if (role === "agency") {
          // Check if agency fields are filled (if they exist in formData)
          const agencyFieldsValid = formData.phone && formData.address && formData.description;
          if (agencyFieldsValid) {
            handleSubmit(e);
          }
        } else {
          handleSubmit(e);
        }
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};
    let isValid = true;

    // Common fields for both roles
    const commonFields = ['username', 'email', 'password'];
    commonFields.forEach(field => {
      newTouched[field] = true;
      const error = validateField(field, formData[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    // Agency-specific fields
    if (role === "agency") {
      const agencyFields = ['phone', 'website', 'address', 'description'];
      agencyFields.forEach(field => {
        newTouched[field] = true;
        const error = validateField(field, formData[field], false);
        newErrors[field] = error;
        if (error) isValid = false;
      });
    }

    setErrors(newErrors);
    setTouched(prev => ({ ...prev, ...newTouched }));
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    
    // Validate entire form
    if (!validateForm()) {
      setSubmitError("Please fix the errors in the form before submitting.");
      return;
    }
    
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Redirect based on role
      navigate(
        role === "traveller" ? "/user/complete-profile" : "/agency/complete-profile",
        { state: { userId: data.userId } }
      );

    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form has any errors
  const hasErrors = Object.values(errors).some(error => error !== "");

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {backgrounds.map((bg, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === currentIndex ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      ))}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <img src={logo} className="w-28 h-28 rounded-full border-4 border-white/30" />
        </div>

        {/* Role switch */}
        <div className="flex mt-14 mb-6 bg-white/10 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setRole("traveller")}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${role === "traveller" ? "bg-emerald-600 text-white" : "text-gray-300"}`}
          >
            Traveller
          </button>
          <button
            type="button"
            onClick={() => setRole("agency")}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${role === "agency" ? "bg-emerald-600 text-white" : "text-gray-300"}`}
          >
            Travel Agency
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label={role === "traveller" ? "Username" : "Agency Name"} 
            name="username" 
            value={formData.username} 
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, 'username')}
            error={errors.username}
            touched={touched.username}
            inputRef={inputRefs.current.username}
            autoFocus
          />
          
          <Input 
            label="Email" 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, 'email')}
            error={errors.email}
            touched={touched.email}
            inputRef={inputRefs.current.email}
          />
          
          <PasswordInput 
            label="Password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, 'password')}
            error={errors.password}
            touched={touched.password}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            inputRef={inputRefs.current.password}
            placeholder="Min 8 chars with A-Z, a-z, 0-9, special"
          />

          {role === "agency" && (
            <>
              <Input 
                label="Phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => handleKeyDown(e, 'phone')}
                error={errors.phone}
                touched={touched.phone}
                inputRef={inputRefs.current.phone}
                placeholder="e.g., +1234567890"
              />
              
              <Input 
                label="Website" 
                name="website" 
                value={formData.website} 
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => handleKeyDown(e, 'website')}
                error={errors.website}
                touched={touched.website}
                inputRef={inputRefs.current.website}
                placeholder="e.g., https://example.com"
              />
              
              <Input 
                label="Address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => handleKeyDown(e, 'address')}
                error={errors.address}
                touched={touched.address}
                inputRef={inputRefs.current.address}
              />
              
              <Textarea 
                label="Description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => handleKeyDown(e, 'description')}
                error={errors.description}
                touched={touched.description}
                inputRef={inputRefs.current.description}
              />
            </>
          )}

          {submitError && <ErrorBox text={submitError} />}
          
          <SubmitButton 
            loading={isLoading} 
            disabled={hasErrors}
            text={role === "traveller" ? "Create Traveller Account" : "Register Agency (Pending Approval)"} 
          />

          <p className="text-center text-sm text-gray-300 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-emerald-600 font-medium">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;

/* Enhanced Helpers with Validation and New Features */
const Input = ({ label, error, touched, inputRef, onKeyDown, ...props }) => (
  <div>
    <label className="block text-sm text-gray-300 mb-1">{label}</label>
    <input
      ref={inputRef}
      onKeyDown={onKeyDown}
      {...props}
      className={`w-full px-4 py-3 rounded-xl bg-white/20 text-white focus:ring-2 transition-colors ${
        error && touched 
          ? 'border border-red-500 focus:ring-red-500' 
          : 'border border-transparent focus:ring-emerald-500'
      }`}
    />
    {error && touched && (
      <p className="text-red-400 text-xs mt-1">{error}</p>
    )}
  </div>
);

const PasswordInput = ({ label, error, touched, showPassword, setShowPassword, inputRef, onKeyDown, ...props }) => (
  <div>
    <label className="block text-sm text-gray-300 mb-1">{label}</label>
    <div className="relative">
      <input
        ref={inputRef}
        onKeyDown={onKeyDown}
        type={showPassword ? "text" : "password"}
        {...props}
        className={`w-full px-4 py-3 pr-10 rounded-xl bg-white/20 text-white focus:ring-2 transition-colors ${
          error && touched 
            ? 'border border-red-500 focus:ring-red-500' 
            : 'border border-transparent focus:ring-emerald-500'
        }`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
    {error && touched && (
      <p className="text-red-400 text-xs mt-1">{error}</p>
    )}
  </div>
);

const Textarea = ({ label, error, touched, inputRef, onKeyDown, ...props }) => (
  <div>
    <label className="block text-sm text-gray-300 mb-1">{label}</label>
    <textarea 
      ref={inputRef}
      onKeyDown={onKeyDown}
      {...props} 
      rows="3" 
      className={`w-full px-4 py-3 rounded-xl bg-white/20 text-white focus:ring-2 transition-colors ${
        error && touched 
          ? 'border border-red-500 focus:ring-red-500' 
          : 'border border-transparent focus:ring-emerald-500'
      }`}
    />
    {error && touched && (
      <p className="text-red-400 text-xs mt-1">{error}</p>
    )}
  </div>
);

const ErrorBox = ({ text }) => (
  <div className="bg-red-500/20 border border-red-500 text-red-400 px-3 py-2 rounded-lg text-sm">{text}</div>
);

const SubmitButton = ({ loading, disabled, text }) => (
  <button 
    type="submit"
    disabled={loading || disabled}
    className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
      disabled 
        ? 'bg-gray-600 cursor-not-allowed opacity-60' 
        : 'bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60'
    }`}
  >
    {loading ? "Submitting..." : text}
  </button>
);