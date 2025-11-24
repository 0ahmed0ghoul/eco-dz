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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', finalFormData);
    setIsSubmitting(false);
    
    // Reset form and selections
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setSelectedBenefits([]);
    
    // Show success message
    alert('Thank you for your message! We\'ll get back to you soon.');
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
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    Phone: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    Location: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    Check: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  };

  const benefitItems = [
    "Sustainable travel experiences",
    "Local community support", 
    "Eco-friendly accommodations",
    "Authentic Algerian culture"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br  from-emerald-50 to-teal-100 mt-15 font-sans text-gray-800 relative overflow-hidden">
      
      <div className="absolute top-10 left-10 w-32 h-32 text-emerald-200 opacity-60">
        <EcoIcons.Leaf />
      </div>
      <div className="absolute bottom-20 right-16 w-24 h-24 text-teal-200 opacity-50">
        <EcoIcons.Leaf />
      </div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 text-emerald-200 opacity-40">
        <EcoIcons.Leaf />
      </div>

      <header className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center py-8 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Contact EcoDz</h1>
          <p className="text-lg opacity-90">Your gateway to eco-friendly travel in beautiful Algeria</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                <EcoIcons.Leaf />
              </div>
              <h2 className="text-2xl font-bold text-emerald-800">Send Us a Message</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 resize-none"
                  placeholder="Tell us about your eco-travel interests or questions..."
                ></textarea>
              </div>

              {/* Selected Benefits Preview */}
              {selectedBenefits.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-emerald-800 mb-2">
                    Selected interests ({selectedBenefits.length}):
                  </p>
                  <ul className="text-sm text-emerald-700 space-y-1">
                    {selectedBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center mr-2">
                          <EcoIcons.Check />
                        </div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition duration-300 transform hover:scale-[1.02] shadow-lg ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-8">
            {/* Contact Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-800 mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <EcoIcons.Email />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Email Us</h4>
                    <p className="text-gray-600 mt-1">contact@ecodz.dz</p>
                    <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <EcoIcons.Phone />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Call Us</h4>
                    <p className="text-gray-600 mt-1">+213 770 123 456</p>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri from 8am to 6pm</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <EcoIcons.Location />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Visit Us</h4>
                    <p className="text-gray-600 mt-1">Algiers, Algeria</p>
                    <p className="text-sm text-gray-500 mt-1">The heart of Algerian eco-tourism</p>
                  </div>
                </div>
              </div>
            </div>
{/* Why Choose EcoDz Card with checkboxes */}
<div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-green-600 rounded-2xl shadow-2xl p-8 text-white">
  <h3 className="text-2xl font-bold mb-4">Why Choose EcoDz?</h3>
  <p className="text-green-100 text-sm mb-4">Select your interests to include in your message:</p>

  <ul className="space-y-4">
    {benefitItems.map((benefit, index) => (
      <li key={index} className="flex items-center">
        <input
          type="checkbox"
          id={`benefit-${index}`}
          checked={selectedBenefits.includes(benefit)}
          onChange={() => toggleBenefit(benefit)}
          className="accent-green-500 w-5 h-5 mr-3 rounded focus:ring-2 focus:ring-white"
        />
        <label
          htmlFor={`benefit-${index}`}
          className={`cursor-pointer select-none transition-all duration-200 ${
            selectedBenefits.includes(benefit)
              ? 'font-semibold text-white'
              : 'text-green-100 hover:text-white'
          }`}
        >
          {benefit}
        </label>
      </li>
    ))}
  </ul>

  {/* Selection Summary */}
  {selectedBenefits.length > 0 && (
    <div className="mt-6 p-4 bg-white bg-opacity-20 rounded-xl border border-white/30">
      <p className="text-base text-black font-medium">
        ✅ <strong>{selectedBenefits.length}</strong> interest{selectedBenefits.length !== 1 ? 's' : ''} selected
      </p>
    </div>
  )}
</div>

          </div>
        </div>
      </main>

    
    </div>
  );
};

export default Contact;
