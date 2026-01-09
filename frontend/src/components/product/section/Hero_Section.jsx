import React from "react";

export default function Hero_Section({ isVisible }) {
  return (
    <>
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-white via-blue-200 to-blue-100 bg-clip-text text-transparent animate-gradient-x">
              Music Collection
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-center max-w-2xl mx-auto text-blue-100 mb-12">
              Explore Shalom's discography, from full albums to singles and live
              recordings. Each release represents a unique chapter in Ko's
              musical journey.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
