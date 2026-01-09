import React from "react";
import { useAbout } from "../../../context/AboutContext";
// image
import Ko_Shalom_Photo_2 from "../../../assets/images/MKA00034-Edit-Edit-Edit.jpg";

export default function Musical_Journey_Section() {
  const { getSectionContent, loading } = useAbout();
  const journeyContent = getSectionContent('musical-journey');

  if (loading) {
    return (
      <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-blue-200/20 rounded mb-4"></div>
            <div className="h-6 bg-blue-200/20 rounded mb-8"></div>
          </div>
        </div>
      </section>
    );
  }

  const musicalJourneyItems = journeyContent?.items || [
    {
      id: 1,
      timeLine: "2010-2013",
      title: "Early Beginnings",
      description: `Started performing in local venues and released first EP "Echoes of Dawn" which gained attention in the independent music scene. Formed the band "Celestial Harmonies" and toured across Southeast Asia.`,
    },
    {
      id: 2,
      timeLine: "2014-2017",
      title: "Rising Recognition",
      description: `Signed with Harmony Records and released debut album "Transcendent Rhythms" which reached #3 on the Asian Music Charts. Collaborated with renowned producers and performed at major music festivals including SoundWave and Harmony Fest.`,
    },
    {
      id: 3,
      timeLine: "2018-Present",
      title: "Global Impact",
      description: `Released critically acclaimed albums "Ethereal Connections" and "Boundless" which showcased a mature evolution in musical style. Embarked on world tours across Asia, Europe, and North America. Founded the music education initiative "Harmonize" to support young musicians.`,
    },
  ];
  return (
    <>
      <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-blue-900/30"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
              {journeyContent?.title || 'Musical Journey'}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
          </div>

          <div className="space-y-20 md:space-y-24">
            {/* Timeline items */}
            {musicalJourneyItems.length &&
              musicalJourneyItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row group bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl transition-all duration-700 shadow-2xl border border-blue-500/20 hover:bg-slate-800/80 hover:scale-[1.02] transform hover:border-blue-400/40"
                >
                  <div className="lg:w-1/3 mb-6 lg:mb-0">
                    <div className="lg:pr-8">
                      <h3 className="text-3xl md:text-4xl font-bold mb-4 text-blue-400 group-hover:text-cyan-300 transition-colors duration-500">
                        {item.timeLine}
                      </h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mb-6 group-hover:w-32 group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-700 rounded-full shadow-lg shadow-blue-500/30"></div>
                      <h4 className="text-xl md:text-2xl font-semibold text-blue-200 group-hover:text-white transition-colors duration-500">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                  <div className="lg:w-2/3 lg:border-l-2 lg:border-blue-500/30 lg:pl-8 group-hover:lg:border-blue-400/50 transition-colors duration-500">
                    <p className="text-lg md:text-xl mb-6 leading-relaxed text-slate-300 group-hover:text-slate-100 transition-colors duration-500">
                      {item.description}
                    </p>
                    <div className="mt-8 overflow-hidden rounded-2xl shadow-xl  transition-all duration-500">
                      <div className="relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={`${item.title} period`}
                            className="w-full h-auto"
                          />
                        ) : (
                          <img
                            src={Ko_Shalom_Photo_2}
                            alt={`${item.title} period`}
                            className="w-full h-auto"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
