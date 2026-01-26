import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from 'emailjs-com';

export default function CampaignQuestions() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    userType: "",
    willingToPay: "",
    paymentPreferences: [],
    premiumFeatures: [],
    recognitionIdeas: "",
    partnershipInterests: [],
    adTolerance: "",
    subscriptionModel: "",
    priceRange: "",
    additionalSuggestions: "",
    email: "",
    allowContact: false,
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => {
      const currentValues = prev[name];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [name]: currentValues.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [name]: [...currentValues, value],
        };
      }
    });
  };

  const questions = [
    // {
    //   id: 1,
    //   title: "How would you use EcoDZ?",
    //   type: "radio",
    //   name: "userType",
    //   options: [
    //     { value: "tourist", label: "Tourist planning to visit Algeria" },
    //     { value: "local", label: "Local exploring Algeria" },
    //     { value: "tour_guide", label: "Tour Guide/Service Provider" },
    //     { value: "business", label: "Business Owner in Tourism" },
    //     { value: "other", label: "Other" },
    //   ],
    // },
    // {
    //   id: 2,
    //   title: "Would you be willing to pay for premium features on EcoDZ?",
    //   type: "radio",
    //   name: "willingToPay",
    //   options: [
    //     { value: "yes", label: "Yes, absolutely" },
    //     { value: "maybe", label: "Maybe, depending on features" },
    //     { value: "no", label: "No, prefer free version" },
    //     { value: "one_time", label: "One-time payment only" },
    //   ],
    // },
    // {
    //   id: 3,
    //   title: "What payment models would you prefer? (Select all that apply)",
    //   type: "multi",
    //   name: "paymentPreferences",
    //   options: [
    //     { value: "subscription", label: "Monthly/Yearly Subscription" },
    //     { value: "pay_per_feature", label: "Pay per Feature/Service" },
    //     { value: "freemium", label: "Freemium with paid upgrades" },
    //     { value: "commission", label: "Commission on bookings" },
    //     { value: "ads_supported", label: "Ad-supported free version" },
    //   ],
    // },
    // {
    //   id: 4,
    //   title:
    //     "Which premium features would you pay for? (Select all that apply)",
    //   type: "multi",
    //   name: "premiumFeatures",
    //   options: [
    //     { value: "verified_guides", label: "Verified Local Guides Directory" },
    //     { value: "booking_system", label: "Direct Booking System" },
    //     { value: "offline_maps", label: "Offline Maps & Guides" },
    //     {
    //       value: "eco_certification",
    //       label: "Eco-Certification for Businesses",
    //     },
    //     { value: "custom_itineraries", label: "Custom Travel Itineraries" },
    //     { value: "priority_support", label: "Priority Customer Support" },
    //     { value: "group_discounts", label: "Group Discounts & Deals" },
    //     { value: "exclusive_content", label: "Exclusive Content & Tours" },
    //   ],
    // },
    {
      id: 5,
      title:
        "What price range would be reasonable for a yearly premium subscription?",
      type: "radio",
      name: "priceRange",
      options: [
        { value: "10_20", label: "1,000 - 2,000 DZD ($10-$20)" },
        { value: "20_40", label: "2,000 - 4,000 DZD ($20-$40)" },
        { value: "40_60", label: "4,000 - 6,000 DZD ($40-$60)" },
        { value: "60_plus", label: "6,000+ DZD ($60+)" },
      ],
    },
    {
      id: 6,
      title: "How do you prefer to access premium features?",
      type: "radio",
      name: "subscriptionModel",
      options: [
        { value: "individual", label: "Individual subscription" },
        { value: "family", label: "Family/Group plan" },
        { value: "pay_as_you_go", label: "Pay-as-you-go credits" },
        { value: "enterprise", label: "Enterprise/business plan" },
      ],
    },
    {
      id: 7,
      title: "How tolerant are you of ads in exchange for free features?",
      type: "radio",
      name: "adTolerance",
      options: [
        { value: "high", label: "High - Show me relevant ads" },
        { value: "moderate", label: "Moderate - Minimal, non-intrusive ads" },
        { value: "low", label: "Low - Prefer ad-free experience" },
        { value: "none", label: "None - Will pay to remove ads" },
      ],
    },
    {
      id: 8,
      title:
        "Which partnerships would help EcoDZ become more recognizable? (Select all that apply)",
      type: "multi",
      name: "partnershipInterests",
      options: [
        { value: "airlines", label: "Airlines & Travel Agencies" },
        { value: "hotels", label: "Hotels & Accommodations" },
        { value: "government", label: "Government Tourism Departments" },
        { value: "influencers", label: "Travel Influencers & Bloggers" },
        { value: "eco_brands", label: "Eco-Friendly Brands" },
        { value: "universities", label: "Universities & Research Centers" },
        { value: "events", label: "Tourism Events & Festivals" },
      ],
    },
    {
      id: 9,
      title:
        "Any ideas to make EcoDZ more recognizable in Algeria and internationally?",
      type: "textarea",
      name: "recognitionIdeas",
      placeholder:
        "e.g., Mobile app launch, Social media campaigns, Partnerships with...",
    },
    {
      id: 10,
      title: "Additional suggestions for revenue generation or brand growth?",
      type: "textarea",
      name: "additionalSuggestions",
      placeholder: "Your creative ideas here...",
    },
    {
      id: 11,
      title: "Email (Optional - if you'd like updates)",
      type: "email",
      name: "email",
      placeholder: "your.email@example.com",
    },
    {
      id: 12,
      title: "Can we contact you for follow-up discussions?",
      type: "checkbox",
      name: "allowContact",
      label: "Yes, I'm open to being contacted about my feedback",
    },
  ];

  const currentQuestion = questions[currentStep - 1];
  const totalSteps = questions.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

const handleSubmit = () => {
  console.log('Form submitted:', formData);

  // Send email only if user provided an email
  if (formData.email) {
    const templateParams = {
      name: formData.name || "EcoDZ User",
      email: formData.email,
      // You can include other dynamic data if you want
    };

    emailjs.send(
      'service_z1lsqaj',    // e.g., 'service_xxxxx'
      'template_nj67t6v',   // e.g., 'template_yyyyy'
      templateParams,
      'fFkGFpx7CyaRW4IkA'     // e.g., 'user_zzzzzz'
    )
    .then((response) => {
      console.log('Email sent successfully!', response.status, response.text);
    })
    .catch((err) => {
      console.error('Email sending failed:', err);
    });
  }

  alert('Thank you for your valuable feedback! Your input will help shape the future of EcoDZ.');
  navigate('/');
};

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case "radio":
        return (
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  formData[currentQuestion.name] === option.value
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion.name}
                  value={option.value}
                  checked={formData[currentQuestion.name] === option.value}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-4 text-gray-700 font-medium">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "multi":
        return (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  formData[currentQuestion.name].includes(option.value)
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData[currentQuestion.name].includes(
                    option.value
                  )}
                  onChange={() =>
                    handleMultiSelect(currentQuestion.name, option.value)
                  }
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="ml-4 text-gray-700 font-medium">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "textarea":
        return (
          <textarea
            name={currentQuestion.name}
            value={formData[currentQuestion.name]}
            onChange={handleInputChange}
            placeholder={currentQuestion.placeholder}
            rows={6}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-300 resize-none"
          />
        );

      case "email":
        return (
          <input
            type="email"
            name={currentQuestion.name}
            value={formData[currentQuestion.name]}
            onChange={handleInputChange}
            placeholder={currentQuestion.placeholder}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-300"
          />
        );

      case "checkbox":
        return (
          <label className="flex items-center p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-300 transition-all duration-300">
            <input
              type="checkbox"
              name={currentQuestion.name}
              checked={formData[currentQuestion.name]}
              onChange={handleInputChange}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span className="ml-4 text-gray-700 font-medium">
              {currentQuestion.label}
            </span>
          </label>
        );

      default:
        return null;
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-emerald-50 py-12 px-4 md:px-8">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-12 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </a>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Help Shape{" "}
            <span className="text-emerald-600 relative inline-block">
              EcoDZ's Future
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 200 12"
              >
                <path
                  d="M0 8 Q50 2, 100 8 T200 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-emerald-400"
                />
              </svg>
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Your feedback will help us build a sustainable business model
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-emerald-600">
              Question {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(getProgressPercentage())}% Complete
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div
          className={`bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Question Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-600 font-bold">
                    {currentStep}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentQuestion.title}
                </h2>
              </div>
            </div>

            {currentQuestion.description && (
              <p className="text-gray-600 ml-14">
                {currentQuestion.description}
              </p>
            )}
          </div>

          {/* Question Input */}
          <div className="mb-12">{renderQuestionInput()}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-100">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentStep === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-emerald-600 hover:bg-emerald-50 hover:gap-3"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 text-gray-600 hover:text-emerald-600 font-medium transition-colors"
              >
                Skip for now
              </button>

              <button
                onClick={handleNext}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-1"
              >
                <span className="relative z-10">
                  {currentStep === totalSteps
                    ? "Submit Feedback"
                    : "Next Question"}
                </span>
                {currentStep < totalSteps && (
                  <svg
                    className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div
          className={`mt-8 bg-gradient-to-r from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Why this matters</h3>
              <p className="text-gray-600">
                Your answers directly influence how EcoDZ will generate revenue
                while staying accessible. We're committed to creating a
                sustainable model that benefits users, local communities, and
                the environment.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Your responses are confidential and will only be used to improve
          EcoDZ. No personal data will be shared with third parties.
        </p>
      </div>
    </section>
  );
}
