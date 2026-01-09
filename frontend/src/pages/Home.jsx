import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
// component
import Hero_Section from "../components/home/section/Hero_Section";
import About_Section from "../components/home/section/About_Section";
//
import { HiArrowNarrowRight } from "react-icons/hi";
import { useContent } from "../context/ContentContext";
import axios from "axios";
import { resolveImage } from '../utils/api';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [latestProducts, setLatestProducts] = useState([]);
  const { getContent } = useContent();
  const latestContent = getContent('home', 'latest');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        const sorted = [...res.data].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setLatestProducts(sorted.slice(0, 3));
      } catch (e) {
        setLatestProducts([]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-x-hidden">
      {/* Hero Section */}
      <Hero_Section isVisible={isVisible} />

      {/* About Section */}
      <About_Section />

      {/* Music Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-1000 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              } bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent`}
            >
              {latestContent?.title || 'Latest Releases'}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
          </div>

          {latestProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {latestProducts.map((prod, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-slate-800/80 to-blue-950/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-500 border border-blue-800/30"
                >
                  <div className="aspect-square bg-gradient-to-br from-blue-800/30 to-slate-700/30 mb-6 rounded-xl group-hover:scale-105 transition-transform duration-300 relative overflow-hidden border border-blue-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent group-hover:opacity-0 transition-opacity duration-300"></div>
                    {prod.image && (
                      <img src={resolveImage(prod.image)} alt={prod.title || ''} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-blue-100 group-hover:text-white transition-colors duration-300">
                    {prod.title}
                  </h3>

                  <p className="text-blue-200/70 mb-6 text-sm sm:text-base">
                    {prod.releaseDate ? `Released: ${prod.releaseDate}` : ''}
                  </p>

                  <NavLink to="/product">
                    <button className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 w-full font-semibold border border-blue-500/30">
                      <span className="relative z-10">Listen</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
                    </button>
                  </NavLink>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-blue-200">No latest releases yet.</div>
          )}

          <div className="text-center mt-12 sm:mt-12 flex justify-center">
            <NavLink to={"/product"}>
              <button className="group relative overflow-hidden flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 w-80 rounded-full hover:scale-105 transition-all duration-300 font-semibold border border-blue-500/30">
                <span className="relative z-10">View All Albums</span>
                <HiArrowNarrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
              </button>
            </NavLink>
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-12 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
            Get In Touch
          </h2>

          <p className="text-lg sm:text-xl lg:text-2xl mb-12 sm:mb-16 text-blue-100 leading-relaxed max-w-2xl mx-auto">
            For bookings, collaborations, or just to say hello
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {["Instagram", "Twitter", "YouTube", "Spotify"].map(
              (platform, index) => (
                <a
                  key={platform}
                  href="#"
                  className={`group relative px-6 py-3 rounded-full border border-blue-400/30 hover:border-blue-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 text-sm sm:text-base font-medium text-blue-100 ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="relative z-10 group-hover:text-slate-900 transition-colors duration-300">
                    {platform}
                  </span>
                  <div className="absolute inset-0 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
                </a>
              )
            )}
          </div>

          <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-5 text-lg lg:text-xl font-bold rounded-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 border border-blue-500/30">
            <span className="relative z-10">Contact Me</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
          </button>
        </div>
      </section>
    </div>
  );
}
