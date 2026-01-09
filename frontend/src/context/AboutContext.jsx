import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AboutContext = createContext();

export const useAbout = () => {
  const context = useContext(AboutContext);
  if (!context) {
    throw new Error('useAbout must be used within an AboutProvider');
  }
  return context;
};

export const AboutProvider = ({ children }) => {
  const [aboutContent, setAboutContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/about-content`);
      const contentData = {};
      
      // Organize content by section
      if (Array.isArray(response.data)) {
        response.data.forEach(item => {
          contentData[item.section] = item;
        });
      } else {
        console.error("Error: response.data is not an array", response.data);
      }
      
      console.log('AboutContext: Fetched content:', contentData);
      setAboutContent(contentData);
      setError(null);
    } catch (err) {
      setError('Failed to load about content');
      console.error('Error fetching about content:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSectionContent = (section) => {
    return aboutContent[section] || null;
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const value = {
    aboutContent,
    loading,
    error,
    getSectionContent,
    refreshContent: fetchAboutContent
  };

  return (
    <AboutContext.Provider value={value}>
      {children}
    </AboutContext.Provider>
  );
}; 