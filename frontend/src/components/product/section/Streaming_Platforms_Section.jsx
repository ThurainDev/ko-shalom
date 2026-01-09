import React from "react";
// logo
import {
  SiSpotify,
  SiApple,
  SiYoutubemusic,
  SiAmazonmusic,
  SiSoundcloud,
  SiBandcamp,
  SiTidal,
} from "react-icons/si";

const platforms = [
  { name: "Spotify", icon: <SiSpotify className="w-10 h-10" /> },
  { name: "Apple Music", icon: <SiApple className="w-10 h-10" /> },
  { name: "YouTube Music", icon: <SiYoutubemusic className="w-10 h-10" /> },
  { name: "Amazon Music", icon: <SiAmazonmusic className="w-10 h-10" /> },
  { name: "SoundCloud", icon: <SiSoundcloud className="w-10 h-10" /> },
  { name: "Bandcamp", icon: <SiBandcamp className="w-10 h-10" /> },
  { name: "Tidal", icon: <SiTidal className="w-10 h-10" /> },
];

export default function Streaming_Platforms_Section() {
  return (
    <>
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-blue-950 via-slate-800 to-blue-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
              Available On
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
          </div>
          <p className="text-lg text-blue-100 mb-12 max-w-2xl mx-auto">
            Listen to Shalom's music on your favorite streaming platforms
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {platforms.length &&
              platforms.map((platform, index) => (
                <a
                  key={platform.name}
                  href="#"
                  className="flex flex-col items-center p-4 hover:bg-blue-500/10 transition-colors duration-300 rounded-lg border border-blue-500/20 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/30 to-slate-700/30 flex items-center justify-center text-2xl mb-3 text-blue-200 border border-blue-500/20">
                    {platform.icon}
                  </div>
                  <span className="font-medium text-blue-100">
                    {platform.name}
                  </span>
                </a>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
