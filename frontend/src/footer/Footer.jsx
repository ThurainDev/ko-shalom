import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// logos
import Instagram_Logo from "../assets/logos/Instagram-Logo.wine.png";
import Youtube_Logo from "../assets/logos/Youtube_Logo.webp";
import Spotify_Logo from "../assets/logos/Spotify_Logo.png";
import Soundcloud_Logo from "../assets/logos/Soundcloud_Logo.png";
import Apple_Music_Logo from "../assets/logos/Apple_Music_Logo.png";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Add a slight delay before triggering the animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Main Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 text-white pt-16 pb-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          {/* Top Section with Logo and Navigation */}
          <div
            className={`flex flex-col md:flex-row justify-between mb-12 transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Logo and Tagline */}
            <div className="mb-8 md:mb-0 md:w-1/3">
              <Link
                to="/"
                className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent hover:from-blue-200 hover:to-blue-100 transition-all duration-300"
              >
                Shalom
              </Link>
              <p className="mt-4 text-blue-200 max-w-xs">
                Creating music that transcends boundaries and connects with
                people on a profound level.
              </p>
            </div>

            {/* Quick Links */}
            <div className="mb-8 md:mb-0 md:w-1/4">
              <h3 className="text-lg font-semibold mb-4 border-b border-blue-600/30 pb-2 text-blue-200">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {[
                  { name: "Home", path: "/" },
                  { name: "About", path: "/about" },
                  { name: "Product", path: "/product" },
                  { name: "Contact", path: "/contact" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-blue-300 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="mb-8 md:mb-0 md:w-1/4">
              <h3 className="text-lg font-semibold mb-4 border-b border-blue-600/30 pb-2 text-blue-200">
                Connect
              </h3>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 1, name: "Instagram", icon: Instagram_Logo },
                  { id: 2, name: "YouTube", icon: Youtube_Logo },
                  { id: 3, name: "Spotify", icon: Spotify_Logo },
                  { id: 4, name: "SoundCloud", icon: Soundcloud_Logo },
                  { id: 5, name: "Apple Music", icon: Apple_Music_Logo },
                ].map((platform, index) => (
                  <a
                    key={index}
                    href="#"
                    title={platform.name}
                    className="w-10 h-10 rounded-full border border-blue-500/40 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center hover:bg-blue-500 hover:border-blue-400 transition-all duration-300 transform hover:scale-110"
                  >
                    <img src={platform.icon} alt="" className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="md:w-1/4">
              <h3 className="text-lg font-semibold mb-4 border-b border-blue-600/30 pb-2 text-blue-200">
                Contact
              </h3>
              <ul className="space-y-3 text-blue-300">
                <li className="flex items-start">
                  <span className="mr-2">📧</span>
                  <a
                    href="mailto:info@koshalom.com"
                    className="hover:text-white transition-colors duration-300"
                  >
                    info@koshalom.com
                  </a>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📱</span>
                  <span>Management: +1 (555) 123-4567</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📍</span>
                  <span>Based in Yangon, Myanmar</span>
                </li>
              </ul>
              <button className="mt-4 border border-blue-500/40 bg-blue-900/20 backdrop-blur-sm px-4 py-2 text-sm hover:bg-blue-500 hover:text-white transition-all duration-300 w-full rounded-lg">
                Contact Me
              </button>
            </div>
          </div>

          {/* Middle Section - Latest News */}
          <div
            className={`border-t border-blue-600/30 pt-10 mb-10 transition-all duration-1000 delay-300 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h3 className="text-xl font-semibold mb-6 text-center text-blue-200">
              Latest News
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "New Album Release",
                  date: "June 15, 2023",
                  excerpt:
                    "Excited to announce my new album 'Harmonic Journeys' will be released next month.",
                },
                {
                  title: "Summer Tour Dates",
                  date: "May 28, 2023",
                  excerpt:
                    "Join me for a series of performances across Southeast Asia this summer.",
                },
                {
                  title: "Collaboration with Local Artists",
                  date: "April 10, 2023",
                  excerpt:
                    "Working with talented local musicians on a special project to be revealed soon.",
                },
              ].map((news, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm border border-blue-600/20 p-4 rounded-lg hover:transform hover:scale-105 hover:bg-slate-800/70 hover:border-blue-500/40 transition-all duration-300"
                >
                  <h4 className="text-lg font-medium mb-1 text-white">
                    {news.title}
                  </h4>
                  <p className="text-xs text-blue-300 mb-2">{news.date}</p>
                  <p className="text-sm text-blue-200">{news.excerpt}</p>
                  <a
                    href="#"
                    className="text-xs text-blue-300 mt-2 inline-block border-b border-transparent hover:border-blue-300 hover:text-white transition-all duration-300"
                  >
                    Read more
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section with Copyright and Policy Links */}
          <div
            className={`border-t border-blue-600/30 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-blue-300 transition-all duration-1000 delay-500 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="mb-4 md:mb-0">
              © {currentYear} Shalom. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-110 ${
            isVisible ? "opacity-70" : "opacity-0"
          }`}
          aria-label="Back to top"
        >
          ↑
        </button>
      </div>
    </>
  );
}
