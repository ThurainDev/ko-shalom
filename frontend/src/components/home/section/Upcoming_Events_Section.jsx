import React from "react";
import { useContent } from "../../../context/ContentContext";

export default function Upcoming_Events_Section({ isVisible }) {
  const { getContent, loading } = useContent();
  const eventsContent = getContent('home', 'events');

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-950 via-slate-800 to-blue-900 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-blue-200/20 rounded mb-4"></div>
            <div className="h-6 bg-blue-200/20 rounded mb-8"></div>
          </div>
        </div>
      </section>
    );
  }

  const events = eventsContent?.items || [];

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-950 via-slate-800 to-blue-900 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
              {eventsContent?.title || 'Upcoming Events'}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-blue-200 text-lg">No upcoming events at the moment.</p>
              <p className="text-blue-300 text-sm mt-2">Check back soon for new announcements!</p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {events.map((event, index) => (
                <div
                  key={index}
                  className={`group bg-gradient-to-r from-slate-800/50 to-blue-900/50 backdrop-blur-sm border-l-4 border-l-blue-400 pl-6 sm:pl-8 py-6 sm:py-8 pr-6 sm:pr-8 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1 rounded-r-2xl border-t border-r border-b border-blue-500/20 cursor-pointer ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 text-blue-100 group-hover:text-white transition-colors duration-300">
                        {event.title || `Event ${index + 1}`}
                      </h3>
                      <p className="text-blue-200/70 text-sm sm:text-base">
                        {event.venue || 'Venue TBA'}
                      </p>
                      {event.description && (
                        <p className="text-blue-300 text-sm mt-2">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <div className="sm:text-right">
                      <p className="font-semibold text-base sm:text-lg mb-3 text-blue-100">
                        {event.date && event.time ? `${event.date} • ${event.time}` : 'Date TBA'}
                      </p>
                      {event.buttonText && (
                        <button className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 w-full font-semibold border border-blue-500/30">
                          <span className="relative z-10">{event.buttonText}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
