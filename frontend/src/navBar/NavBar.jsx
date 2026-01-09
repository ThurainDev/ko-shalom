import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user is admin
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-gradient-to-r from-slate-900/95 via-blue-950/95 to-slate-900/95 backdrop-blur-md text-white py-3 border-b border-blue-500/20" 
          : "bg-transparent text-white py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight hover:opacity-80 transition-all duration-300 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent hover:from-blue-100 hover:via-blue-50 hover:to-blue-100"
          >
            Shalom
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/" label="Home" />
            <NavLink to="/about" label="About" />
            <NavLink to="/product" label="Product" />
            <NavLink to="/contact" label="Contact" />
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="relative font-medium text-blue-200 hover:text-white transition-colors duration-300 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 rounded-lg hover:from-blue-500 hover:to-blue-600 border border-blue-500/30"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-blue-100 hover:text-white focus:outline-none transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-6 flex flex-col items-end space-y-1.5">
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  isOpen ? "w-6 transform rotate-45 translate-y-2" : "w-6"
                }`}
              ></span>
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  isOpen ? "opacity-0" : "w-4"
                }`}
              ></span>
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  isOpen ? "w-6 transform -rotate-45 -translate-y-2" : "w-5"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-slate-900/95 backdrop-blur-md text-white overflow-hidden transition-all duration-300 ease-in-out border-b border-blue-500/20 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-2 space-y-2">
          <MobileNavLink to="/" label="Home" />
          <MobileNavLink to="/about" label="About" />
          <MobileNavLink to="/product" label="Product" />
          <MobileNavLink to="/contact" label="Contact" />
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="block py-3 border-b border-blue-500/20 text-blue-200 hover:text-white hover:bg-blue-500/10 transition-all duration-300 px-2 rounded bg-gradient-to-r from-blue-600 to-blue-700"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// Desktop Navigation Link Component
function NavLink({ to, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative font-medium hover:text-blue-200 transition-colors duration-300 ${
        isActive ? "text-white" : "text-blue-100"
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left transition-transform duration-300 ${
          isActive ? "scale-x-100" : "scale-x-0"
        } hover:scale-x-100`}
      ></span>
    </Link>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({ to, label }) {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to.includes("#") && location.hash === to.substring(to.indexOf("#")));

  return (
    <Link
      to={to}
      className={`block py-3 border-b border-blue-500/20 ${
        isActive ? "text-white" : "text-blue-200"
      } hover:text-white hover:bg-blue-500/10 transition-all duration-300 px-2 rounded`}
    >
      {label}
    </Link>
  );
}
