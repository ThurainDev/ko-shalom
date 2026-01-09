import React from "react";
import { useAbout } from "../../../context/AboutContext";

export default function Awards_Section() {
  const { getSectionContent, loading } = useAbout();
  const awardsSection = getSectionContent('awards');

  if (loading) return <div>Loading...</div>;
  if (!awardsSection) return null;

  return (
    <>
      <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-blue-900/20"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
              {awardsSection.title}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
          </div>

          <div className="space-y-8">
            {awardsSection.items &&
              awardsSection.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-start border-b border-blue-600/30 pb-8 hover:bg-slate-800/50 p-6 rounded-xl transition-all duration-500 group hover:shadow-xl hover:shadow-blue-600/10 backdrop-blur-sm hover:border-blue-500/40 hover:scale-[1.02] transform"
                >
                  <div className="md:w-1/4 font-bold text-2xl md:text-3xl mb-4 md:mb-0 text-blue-300 group-hover:text-blue-200 transition-colors duration-300">
                    {item.timeLine}
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-white group-hover:text-blue-100 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <div className="text-blue-200 text-lg mb-1 group-hover:text-blue-100 transition-colors duration-300" dangerouslySetInnerHTML={{ __html: item.description }} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
