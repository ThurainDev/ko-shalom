import React, { useState, useEffect } from "react";
import { AboutProvider } from "../context/AboutContext";
// component
import Hero_Section from "../components/about/section/Hero_Section";
import Musical_Journey_Section from "../components/about/section/Musical_Journey_Section";
import Awards_Section from "../components/about/section/Awards_Section";
import Philosophy_Section from "../components/about/section/Philosophy_Section";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AboutProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-20 relative overflow-hidden">
        {/* Hero Section */}
        <Hero_Section isVisible={isVisible} />

        {/* Musical Journey Section */}
        <Musical_Journey_Section />

        {/* Awards & Recognition Section */}
        <Awards_Section />

        {/* Philosophy Section */}
        <Philosophy_Section />
      </div>
    </AboutProvider>
  );
}
