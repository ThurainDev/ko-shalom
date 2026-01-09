import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/content');
      const contentData = {};
      
      // Organize content by page and section
      if (Array.isArray(response.data)) {
        response.data.forEach(item => {
          if (!contentData[item.page]) {
            contentData[item.page] = {};
          }
          const existing = contentData[item.page][item.section];
          if (!existing || new Date(item.updatedAt) > new Date(existing.updatedAt)) {
            contentData[item.page][item.section] = item;
          }
        });
      } else {
        console.error("Error: response.data is not an array", response.data);
      }
      
      setContent(contentData);
      setError(null);
    } catch (err) {
      setError('Failed to load content');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const getContent = (page, section) => {
    return content[page]?.[section] || null;
  };

  const getPageContent = (page) => {
    return content[page] || {};
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const value = {
    content,
    loading,
    error,
    getContent,
    getPageContent,
    refreshContent: fetchContent
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};