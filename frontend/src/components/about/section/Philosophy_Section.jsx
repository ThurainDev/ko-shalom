import React from "react";
import { useAbout } from "../../../context/AboutContext";

export default function Philosophy_Section() {
  const { getSectionContent, loading } = useAbout();
  const philosophySection = getSectionContent('philosophy');

  if (loading) return <div>Loading...</div>;
  if (!philosophySection) return null;

  return (
    <>
      <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-800/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-blue-900/8 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
              {philosophySection.title}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
          </div>

          <div className="mt-16 max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: philosophySection.description }} />
        </div>
      </section>
    </>
  );
}
