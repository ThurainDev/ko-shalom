import React from "react";
import { resolveImage } from '../../../utils/api';
import { useAbout } from "../../../context/AboutContext";
// image
import Ko_Shalom_Photo from "../../../assets/images/MKA00034-Edit-Edit-Edit.jpg";

export default function Hero_Section({ isVisible }) {
  const { getSectionContent, loading } = useAbout();
  const heroContent = getSectionContent('hero');
  
  console.log('Hero_Section: heroContent:', heroContent);

  if (loading) {
    return (
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="animate-pulse">
            <div className="h-16 bg-blue-200/20 rounded mb-4"></div>
            <div className="h-6 bg-blue-200/20 rounded mb-8"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-center bg-gradient-to-r from-white via-blue-200 to-blue-100 bg-clip-text text-transparent animate-gradient-x">
              {heroContent?.title || 'About Shalom'}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mb-8"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            <div
              className={`lg:w-1/2 transition-all duration-1000 delay-300 transform ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                {heroContent?.image ? (
                  <img
                    src={resolveImage(heroContent.image)}
                    alt={heroContent.title || "Ko Shalom"}
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

            <div
              className={`lg:w-1/2 transition-all duration-1000 delay-500 transform ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-blue-200">
                {heroContent?.subtitle || 'The Artist'}
              </h2>
              <div className="space-y-6 text-lg md:text-xl leading-relaxed">
                {heroContent?.description ? (
                  <div 
                    className="text-gray-200 hover:text-white transition-colors duration-300"
                    dangerouslySetInnerHTML={{ __html: heroContent.description }}
                  />
                ) : (
                  <>
                    <p className="text-gray-200 hover:text-white transition-colors duration-300">
                      Shalom is an acclaimed musician, composer, and performer with
                      a passion for creating music that transcends boundaries and
                      connects with people on a profound level.
                    </p>
                    <p className="text-gray-200 hover:text-white transition-colors duration-300">
                      Born in Myanmar and raised in a family of musicians, Ko's
                      journey began at an early age when he first picked up a guitar
                      at the age of seven. His unique approach to blending
                      traditional Asian influences with contemporary Western sounds
                      has earned him recognition across the global music scene.
                    </p>
                    <p className="text-gray-200 hover:text-white transition-colors duration-300">
                      With over a decade of experience performing in venues around
                      the world, Ko continues to push the boundaries of musical
                      expression while staying true to his artistic vision.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
