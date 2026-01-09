import React from "react";
import { useContent } from "../../../context/ContentContext";
import { resolveImage } from '../../../utils/api';

export default function Hero_Section({ isVisible }) {
  const { getContent, loading } = useContent();
  const heroContent = getContent('home', 'hero');

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-blue-200/20 rounded mb-4"></div>
            <div className="h-8 bg-blue-200/20 rounded mb-8"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className={`relative z-10 transition-all duration-1500 ease-out transform ${
            isVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-16 opacity-0 scale-95"
          }`}
        >
          <div className="text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-white via-blue-200 to-blue-100 bg-clip-text text-transparent animate-gradient-x">
                  {heroContent?.title || 'Shalom'}
                </span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mb-8"></div>
            </div>

            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-12 max-w-3xl mx-auto text-blue-100 leading-relaxed">
              {heroContent?.subtitle || 'Musician • Composer • Performer'}
            </p>

            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              {heroContent?.buttonText && (
                <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full hover:scale-105 transition-all duration-300 w-full sm:w-auto border border-blue-500/30">
                  <span className="relative z-10">{heroContent.buttonText}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
                </button>
              )}

              {heroContent?.secondaryButtonText && (
                <button className="group relative overflow-hidden border-2 border-blue-400 text-blue-100 px-8 py-4 text-lg font-semibold rounded-full hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                  <span className="relative z-10 group-hover:text-slate-900 transition-colors duration-300">
                    {heroContent.secondaryButtonText}
                  </span>
                  <div className="absolute inset-0 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Background overlay */}
        <div className="absolute inset-0 z-[-1]">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-blue-950/80"></div>
          {heroContent?.backgroundImage ? (
            <div 
              className="h-full w-full bg-cover bg-center bg-fixed opacity-20"
              style={{ backgroundImage: `url(${resolveImage(heroContent.backgroundImage)})` }}
            ></div>
          ) : (
            <div className="h-full w-full bg-[url('/musician-bg.jpg')] bg-cover bg-center bg-fixed opacity-20"></div>
          )}
        </div>
      </section>
    </>
  );
}
