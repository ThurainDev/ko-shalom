import React, { useState, useEffect } from "react";
import axios from "axios";
// component
import Hero_Section from "../components/contact/section/Hero_Section";
import FAQ_Section from "../components/contact/section/FAQ_Section";

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitMessage(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, {
        ...formData,
        type: activeTab
      });
      setIsSubmitting(false);
      setSubmitMessage("Thank you for your message! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setSubmitMessage(null), 5000);
    } catch (err) {
      setIsSubmitting(false);
      setSubmitError(err?.response?.data?.error || "Failed to send message. Please try again.");
      setTimeout(() => setSubmitError(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-20 relative overflow-hidden">
      {/* Hero Section */}
      <Hero_Section isVisible={isVisible} />

      {/* Contact Options Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-slate-800/50 via-blue-900/30 to-slate-800/50 backdrop-blur-sm border-y border-blue-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {/* Contact Info */}
            <div className="md:w-1/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-100 bg-clip-text text-transparent">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-200">
                      Email
                    </h3>
                    <a
                      href="mailto:info@koshalom.com"
                      className="text-blue-300 hover:text-cyan-300 transition-colors duration-300"
                    >
                      info@koshalom.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-200">
                      Management
                    </h3>
                    <p className="text-blue-300">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-200">
                      Location
                    </h3>
                    <p className="text-blue-300">Based in Yangon, Myanmar</p>
                    <p className="text-blue-300">
                      Available for worldwide bookings
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4 text-blue-200">
                  Connect
                </h3>
                <div className="flex space-x-4">
                  {["Instagram", "Twitter", "YouTube", "Spotify"].map(
                    (platform) => (
                      <a
                        key={platform}
                        href="#"
                        className="w-10 h-10 rounded-full border-2 border-blue-400/50 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:border-transparent hover:text-white transition-all duration-300 text-blue-300 hover:scale-110"
                      >
                        {platform[0]}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:w-2/3 bg-slate-800/30 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-blue-500/20">
              <div className="mb-8">
                <div className="flex border-b border-blue-500/30">
                  <button
                    className={`px-4 py-2 font-medium transition-all duration-300 ${
                      activeTab === "general"
                        ? "border-b-2 border-blue-400 text-blue-300"
                        : "text-blue-400 hover:text-blue-300"
                    }`}
                    onClick={() => setActiveTab("general")}
                  >
                    General Inquiry
                  </button>
                  <button
                    className={`px-4 py-2 font-medium transition-all duration-300 ${
                      activeTab === "booking"
                        ? "border-b-2 border-blue-400 text-blue-300"
                        : "text-blue-400 hover:text-blue-300"
                    }`}
                    onClick={() => setActiveTab("booking")}
                  >
                    Booking Request
                  </button>
                  <button
                    className={`px-4 py-2 font-medium transition-all duration-300 ${
                      activeTab === "press"
                        ? "border-b-2 border-blue-400 text-blue-300"
                        : "text-blue-400 hover:text-blue-300"
                    }`}
                    onClick={() => setActiveTab("press")}
                  >
                    Press Inquiry
                  </button>
                </div>
              </div>

              {submitMessage ? (
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 text-green-300 px-4 py-3 rounded-lg relative mb-6 animate-fade-in backdrop-blur-sm">
                  <span className="block sm:inline">{submitMessage}</span>
                </div>
              ) : null}

              {submitError && (
                <div className="bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-400/50 text-red-300 px-4 py-3 rounded-lg relative mb-6 animate-fade-in backdrop-blur-sm">
                  <span className="block sm:inline">{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-blue-200 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-slate-700/50 border border-blue-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-white placeholder-blue-300/50 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-blue-200 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-slate-700/50 border border-blue-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-white placeholder-blue-300/50 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-blue-200 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-blue-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-white placeholder-blue-300/50 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-blue-200 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-blue-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-white placeholder-blue-300/50 backdrop-blur-sm"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-md hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ_Section />

      {/* Map Section */}
      <section className="bg-gradient-to-br from-slate-800 via-blue-900/30 to-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-96 bg-gradient-to-br from-blue-900/50 to-slate-800/50 backdrop-blur-sm">
            {/* Map would go here - replace with actual map implementation */}
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-900/30 to-slate-800/30 backdrop-blur-sm">
              <p className="text-blue-300 text-lg">Map Location</p>
            </div>
          </div>
          <div className="p-12 flex items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-100 bg-clip-text text-transparent">
                Visit Our Studio
              </h2>
              <p className="text-lg mb-8 text-blue-200">
                While most of our communication happens online, we welcome
                visitors to our studio by appointment. Please contact us in
                advance to schedule a visit.
              </p>
              <button className="px-8 py-3 border-2 border-blue-400 text-blue-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-transparent transition-all duration-300 rounded-md transform hover:scale-105">
                Schedule a Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Stay Updated
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-200">
            Subscribe to our newsletter to receive updates about new music
            releases, upcoming performances, and exclusive content.
          </p>

          <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 bg-slate-800/50 backdrop-blur-sm border-2 border-blue-500/30 focus:border-blue-400 focus:outline-none transition-colors duration-300 text-white placeholder-blue-300/50 rounded-md"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 rounded-md transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              Subscribe
            </button>
          </form>

          <p className="mt-4 text-sm text-blue-400/70">
            We respect your privacy and will never share your information.
          </p>
        </div>
      </section>
    </div>
  );
}
