import React from "react";

const genres = [
  {
    id: 1,
    name: "Contemporary Fusion",
  },
  {
    id: 2,
    name: "Experimental Jazz",
  },
  {
    id: 3,
    name: "Neo-Classical",
  },
  {
    id: 4,
    name: "Ambient Electronic&B",
  },
  {
    id: 5,
    name: "Traditional Asian",
  },
];

const influences = [
  {
    id: 1,
    name: "Indie Folk",
  },
  {
    id: 2,
    name: "Jazz",
  },
  {
    id: 3,
    name: "Rock",
  },
  {
    id: 4,
    name: "Pop",
  },
  {
    id: 5,
    name: "Hip-Hop",
  },
  {
    id: 6,
    name: "R&B",
  },
];

const instruments = [
  {
    id: 1,
    name: "Guitar",
  },
  {
    id: 2,
    name: "Bass",
  },
  {
    id: 3,
    name: "Drums",
  },
  {
    id: 4,
    name: "Keyboard",
  },
  {
    id: 5,
    name: "Piano",
  },
  {
    id: 6,
    name: "Synthesizer",
  },
];

export default function Musical_Style_Section() {
  return (
    <>
      <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
              Musical Style & Influences
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Genres */}
            <div className="bg-gradient-to-br from-slate-800/80 to-blue-950/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-500 border border-blue-800/30">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-blue-200">
                Genres
              </h3>
              <ul className="space-y-2 text-gray-200">
                {genres.length &&
                  genres.map((genre, index) => (
                    <li key={index} className="flex items-center group">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></span>
                      <span className="group-hover:text-white transition-colors duration-300">
                        {genre.name}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Influences */}
            <div className="bg-gradient-to-br from-slate-800/80 to-blue-950/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-500 border border-blue-800/30">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-blue-200">
                Influences
              </h3>
              <ul className="space-y-2 text-gray-200">
                {influences.length &&
                  influences.map((influence, index) => (
                    <li key={index} className="flex items-center group">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></span>
                      <span className="group-hover:text-white transition-colors duration-300">
                        {influence.name}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Instruments */}
            <div className="bg-gradient-to-br from-slate-800/80 to-blue-950/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-500 border border-blue-800/30">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-blue-200">
                Instruments
              </h3>
              <ul className="space-y-2 text-gray-200">
                {instruments.length &&
                  instruments.map((instrument, index) => (
                    <li key={index} className="flex items-center group">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></span>
                      <span className="group-hover:text-white transition-colors duration-300">
                        {instrument.name}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-blue-950/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-500 border border-blue-800/30">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-blue-200">
                Signature Sound
              </h3>
              <p className="text-gray-200 leading-relaxed hover:text-white transition-colors duration-300">
                Shalom's music is characterized by intricate layering of
                traditional and modern instruments, creating atmospheric
                soundscapes that blend cultural elements with contemporary
                production techniques. His compositions often feature unexpected
                harmonic progressions and rhythmic patterns that challenge
                conventional musical boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
