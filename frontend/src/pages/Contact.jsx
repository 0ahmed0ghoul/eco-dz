import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Add selected benefits to the message
    const benefitsText = selectedBenefits.length > 0 
      ? `\n\nI'm interested in:\n${selectedBenefits.map(benefit => `• ${benefit}`).join('\n')}`
      : '';

    const finalFormData = {
      ...formData,
      message: formData.message + benefitsText
    };
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', finalFormData);
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form and selections
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setSelectedBenefits([]);
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const toggleBenefit = (benefit) => {
    setSelectedBenefits(prev => 
      prev.includes(benefit)
        ? prev.filter(item => item !== benefit)
        : [...prev, benefit]
    );
  };

  // Eco-themed icons as SVG components
  const EcoIcons = {
    Leaf: () => (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.29c-.01-.02-.02-.03-.03-.05C8.67 16.11 10.5 13 17 8zm-.5 2c-4.5 2-6.02 4.3-7.48 7.09-.75 1.44-1.54 2.95-2.3 4.44l-.16.32c.73.14 1.47.25 2.21.33.15-1.32.47-2.63.95-3.88.88-2.25 2.29-4.28 4.13-5.98.34-.31.7-.6 1.07-.87.21-.15.43-.29.65-.42.17-.1.34-.19.52-.28.07-.04.15-.07.22-.11.1-.05.2-.1.3-.14.06-.03.13-.05.19-.08.1-.04.21-.08.31-.11.06-.02.12-.04.18-.06.12-.04.24-.07.36-.1.06-.02.12-.03.18-.04.14-.03.28-.06.42-.08.05-.01.1-.02.15-.03.17-.03.34-.05.51-.06.04 0 .08-.01.12-.01.2-.02.39-.03.59-.03.04 0 .08 0 .12.01.19.01.38.03.56.06.05.01.1.02.15.03.14.02.28.05.41.08.06.01.12.03.18.04.12.03.24.06.35.1.06.02.12.04.18.06.1.03.21.07.31.11.06.03.13.05.19.08.1.05.2.09.3.14.07.04.15.07.22.11.18.09.35.18.52.28.22.13.44.27.65.42.37.27.73.56 1.07.87 1.84 1.7 3.25 3.73 4.13 5.98.48 1.25.8 2.56.95 3.88.74-.08 1.48-.19 2.21-.33l-.16-.32c-.76-1.49-1.55-3-2.3-4.44C23.52 14.3 21.5 12 17.5 10z"/>
      </svg>
    ),
    Email: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    Phone: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    Location: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    Check: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    Send: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    )
  };

  const benefitItems = [
    "Sustainable travel experiences",
    "Local community support", 
    "Eco-friendly accommodations",
    "Authentic Algerian culture",
    "Nature conservation tours",
    "Carbon offset programs"
  ];

  return (
    <section id="contact" className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white py-16 px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${(i * 15) % 100}%`,
              top: `${(i * 20) % 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + i * 2}s`
            }}
          >
            <div className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-200/30">
              <EcoIcons.Leaf />
            </div>
          </div>
        ))}
      </div>

      {/* Success Message */}
      {isSubmitted && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-slideIn">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <EcoIcons.Check />
            </div>
            <div>
              <p className="font-semibold">Message Sent Successfully!</p>
              <p className="text-sm opacity-90">We'll get back to you within 24 hours.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
              <EcoIcons.Leaf />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Contact EcoDz
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Get in touch to start your sustainable Algerian adventure. We're here to help!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Info Cards */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-emerald-100/50 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-emerald-800 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <EcoIcons.Email />,
                    title: "Email Address",
                    detail: "contact@ecodz.dz",
                    description: "Response within 24 hours"
                  },
                  {
                    icon: <EcoIcons.Phone />,
                    title: "Phone Number",
                    detail: "+213 770 123 456",
                    description: "Mon-Fri, 8am-6pm (GMT+1)"
                  },
                  {
                    icon: <EcoIcons.Location />,
                    title: "Our Location",
                    detail: "Algiers, Algeria",
                    description: "Heart of Algerian eco-tourism"
                  }
                ].map((item, index) => (
                  <div key={index} className="group flex items-start gap-4 p-4 rounded-xl hover:bg-emerald-50/50 transition-all duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="text-emerald-600">
                        {item.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 mt-1 text-lg">{item.detail}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Selection */}
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 rounded-2xl shadow-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <EcoIcons.Leaf />
                </div>
                <h3 className="text-2xl font-bold">Your Interests</h3>
              </div>
              
              <p className="text-emerald-100 mb-6">Select what interests you about EcoDz:</p>
              
              <div className="space-y-3">
                {benefitItems.map((benefit, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedBenefits.includes(benefit)
                        ? 'bg-white/20 border-2 border-white/30'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                      selectedBenefits.includes(benefit)
                        ? 'bg-white border-white'
                        : 'border-white/50 bg-transparent'
                    }`}>
                      {selectedBenefits.includes(benefit) && (
                        <EcoIcons.Check />
                      )}
                    </div>
                    <span className="flex-1">{benefit}</span>
                    <input
                      type="checkbox"
                      checked={selectedBenefits.includes(benefit)}
                      onChange={() => toggleBenefit(benefit)}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>

              {/* Selection Counter */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100">
                    {selectedBenefits.length} interest{selectedBenefits.length !== 1 ? 's' : ''} selected
                  </span>
                  {selectedBenefits.length > 0 && (
                    <button
                      onClick={() => setSelectedBenefits([])}
                      className="text-sm px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-300"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-emerald-100/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-emerald-800">Send us a message</h2>
                  <p className="text-gray-600 mt-2">We'd love to hear from you</p>
                </div>
                <div className="hidden md:block w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                  <EcoIcons.Send />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-3 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 placeholder-gray-400"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-3 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 placeholder-gray-400"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-3 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 placeholder-gray-400"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-3 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 placeholder-gray-400 resize-none"
                    placeholder="Tell us about your eco-travel dreams..."
                  ></textarea>
                </div>

                {/* Benefits Preview */}
                {selectedBenefits.length > 0 && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <EcoIcons.Check />
                      </div>
                      <p className="font-medium text-emerald-800">
                        Your selected interests ({selectedBenefits.length})
                      </p>
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {selectedBenefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-emerald-700 bg-white/50 px-3 py-2 rounded-lg">
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 px-8 rounded-xl 
                    hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02] 
                    shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                    flex items-center justify-center gap-3`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending your message...
                    </>
                  ) : (
                    <>
                      <EcoIcons.Send />
                      Send Message
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-float { animation: float infinite ease-in-out; }
        .animate-slideIn { animation: slideIn 0.5s ease-out; }
      `}</style>
    </section>
  );
};

export default Contact;