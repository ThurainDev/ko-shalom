import React from "react";
import { NavLink } from "react-router-dom";
import { useContent } from "../../../context/ContentContext";
import { resolveImage } from "../../../utils/api";
// image
import Ko_Shalom_Photo from "../../../assets/images/MKA00034-Edit-Edit-Edit.jpg";

export default function About_Section() {
  const { getContent, loading } = useContent();
  const aboutContent = getContent('home', 'about');

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-blue-200/20 rounded mb-4"></div>
            <div className="h-6 bg-blue-200/20 rounded mb-8"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
              {aboutContent?.title || 'About Me'}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="lg:w-1/2 group">
              <div className="relative overflow-hidden rounded-2xl border border-blue-500/20">
                {aboutContent?.image ? (
                  <img
                    src={resolveImage(aboutContent.image)}
                    alt={aboutContent.title || "Ko Shalom"}
                    className="w-full h-auto"
                  />
                ) : (
                  <img
                    src={Ko_Shalom_Photo}
                    alt="Ko Shalom"
                    className="w-full h-auto"
                  />
                )}
              </div>
            </div>

            <div className="lg:w-1/2 space-y-6">
              {aboutContent?.description ? (
                <div 
                  className="text-lg sm:text-xl leading-relaxed text-blue-100"
                  dangerouslySetInnerHTML={{ __html: aboutContent.description }}
                />
              ) : (
                <>
                  <p className="text-lg sm:text-xl leading-relaxed text-blue-100">
                    Shalom is a versatile musician with over 10 years of experience
                    in composing, performing, and producing music across various
                    genres.
                  </p>

                  <p className="text-lg sm:text-xl leading-relaxed text-blue-100">
                    With a unique approach to blending traditional and contemporary
                    sounds, Ko has established a distinctive musical identity that
                    resonates with audiences worldwide.
                  </p>
                </>
              )}

              <div className="pt-4">
                <NavLink to={"/about"}>
                  <button className="group relative overflow-hidden border-2 border-blue-400 text-blue-100 px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 font-semibold">
                    <span className="relative z-10 group-hover:text-slate-900 transition-colors duration-300">
                      {aboutContent?.buttonText || 'Read More'}
                    </span>
                    <div className="absolute inset-0 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
