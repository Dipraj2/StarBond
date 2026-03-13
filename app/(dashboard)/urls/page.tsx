import React from 'react';
import { useEffect, useState } from 'react';
import { fetchUserUrls } from '../../../lib/api'; // Adjust the import path as necessary
import UrlCard from '../../../components/url-card'; // Assuming you have a UrlCard component

const UrlsPage: React.FC = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUrls = async () => {
      try {
        const userUrls = await fetchUserUrls();
        setUrls(userUrls);
      } catch (error) {
        console.error('Failed to fetch URLs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUrls();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="urls-page">
      <h1>Your Shortened URLs</h1>
      {urls.length === 0 ? (
        <p>No URLs found. Create a new one!</p>
      ) : (
        <div className="url-list">
          {urls.map((url) => (
            <UrlCard key={url.id} url={url} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UrlsPage;