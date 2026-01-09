import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// component
import Hero_Section from "../components/product/section/Hero_Section";
import Streaming_Platforms_Section from "../components/product/section/Streaming_Platforms_Section";
import FAQ_Section from "../components/product/section/FAQ_Section";
import { uploadsPath } from "../utils/api";

export default function Product() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [modalType, setModalType] = useState(null); // 'details' or 'listen'

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/products`);
      setProducts(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on active category
  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((product) => product.type === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-20 relative overflow-hidden">
      {/* Hero Section */}
      <Hero_Section isVisible={isVisible} />

      {/* Category Filter Section */}
      <section className="py-4 bg-gradient-to-r from-blue-950/50 via-slate-800/50 to-blue-950/50 backdrop-blur-sm border-y border-blue-500/20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div
            className={`flex overflow-x-auto hide-scrollbar gap-1 sm:gap-2 justify-center transition-all duration-1000 delay-300 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {["all", "album", "ep", "single", "live"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                aria-label={`Filter by ${
                  category === "all" ? "all categories" : category
                }`}
                className={`px-4 py-2 mx-1 sm:mx-2 rounded-full transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border border-blue-500/30"
                    : "bg-transparent text-blue-100 border border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/10"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}s
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-12 px-3 md:py-16 md:px-8 bg-gradient-to-br from-blue-950/30 via-slate-800/30 to-blue-900/30 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          {loading ? (
            <div className="text-center text-blue-200 py-12">Loading products...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-12">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id || product.id}
                  className={`bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-500 transform hover:scale-105  border border-blue-500/20 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-20 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredProduct(product._id || product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="aspect-square bg-gradient-to-br from-blue-800/30 to-slate-700/30 relative border-b border-blue-500/10">
                    {/* Product image or placeholder */}
                    {product.image ? (
                      <img src={uploadsPath(product.image)} alt={product.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-blue-300/60 text-4xl sm:text-6xl font-thin">
                        ♪
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-blue-900/80 to-slate-900/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
                        hoveredProduct === (product._id || product.id)
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <div className="space-y-2 sm:space-y-3">
                        <button className="block border border-blue-400 text-blue-100 px-4 py-2 sm:px-6 text-sm sm:text-base rounded-full hover:bg-blue-400 hover:text-slate-900 transition-colors duration-300">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold pr-2 text-blue-100">
                        {product.title}
                      </h3>
                      <span className="text-base sm:text-lg font-bold text-blue-200 flex-shrink-0">
                        {product.price}
                      </span>
                    </div>
                    <div className="mb-2 text-blue-300 text-sm">
                      {product.releaseDate} &middot; {product.type}
                    </div>
                    <div className="mb-4 text-gray-200 text-sm">
                      {product.description}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-blue-200">Tracks:</span>
                      <ul className="list-disc list-inside text-blue-100 text-sm">
                        {product.tracks && product.tracks.map((track, i) => (
                          <li key={i}>{track.title} ({track.duration})</li>
                        ))}
                      </ul>
                    </div>
                    {/* Listen and Details Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button
                        className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded transition-all hover:from-blue-500 hover:to-blue-600"
                        onClick={() => { setModalProduct(product); setModalType('listen'); }}
                      >
                        Listen
                      </button>
                      <button
                        className="w-full py-2 border border-blue-400 text-blue-100 font-semibold rounded transition-colors hover:bg-blue-400 hover:text-slate-900"
                        onClick={() => { setModalProduct(product); setModalType('details'); }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Streaming Platforms Section */}
      <Streaming_Platforms_Section />

      {/* FAQ Section */}
      <FAQ_Section />

      {/* Modal for Details or Listen */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-slate-900 rounded-lg shadow-2xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-blue-200 hover:text-white text-2xl"
              onClick={() => { setModalProduct(null); setModalType(null); }}
            >
              &times;
            </button>
            <div className="mb-4 flex flex-col items-center">
              {modalProduct.image ? (
                <img src={uploadsPath(modalProduct.image)} alt={modalProduct.title} className="w-40 h-40 object-cover rounded mb-2" />
              ) : (
                <div className="w-40 h-40 bg-slate-700 rounded flex items-center justify-center text-blue-300/60 text-5xl mb-2">♪</div>
              )}
              <h2 className="text-2xl font-bold text-blue-100 mb-1">{modalProduct.title}</h2>
              <div className="text-blue-300 mb-2">{modalProduct.releaseDate} &middot; {modalProduct.type}</div>
              <div className="text-blue-200 mb-2">{modalProduct.price}</div>
              <div className="text-gray-200 text-center mb-4">{modalProduct.description}</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-200 mb-2">Tracks</h3>
              <ul className="space-y-3">
                {modalProduct.tracks && modalProduct.tracks.map((track, i) => (
                  <li key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/60 rounded p-3">
                    <div className="flex-1">
                      <span className="font-semibold text-blue-100">{i + 1}. {track.title}</span>
                      <span className="ml-2 text-blue-300 text-sm">({track.duration})</span>
                    </div>
                    {modalType === 'listen' && track.audio ? (
                      <audio controls className="mt-2 sm:mt-0 w-full sm:w-48">
                        <source src={uploadsPath(track.audio)} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    ) : modalType === 'listen' && !track.audio ? (
                      <span className="text-blue-400 text-xs ml-2">No audio</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
            {modalType === 'listen' && modalProduct.tracks && modalProduct.tracks.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-blue-200 mb-2">Album Player</h3>
                <audio controls className="w-full" src={uploadsPath(modalProduct.tracks[0].audio)}></audio>
                {/* Optionally, add playlist controls here */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
