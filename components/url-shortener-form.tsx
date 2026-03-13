import React, { useState } from 'react';

const UrlShortenerForm: React.FC = () => {
    const [url, setUrl] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('/api/urls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, visibility }),
            });

            if (!response.ok) {
                throw new Error('Failed to shorten URL');
            }

            const data = await response.json();
            setShortenedUrl(data.shortenedUrl);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="url-shortener-form">
            <h2>Shorten Your URL</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="url">URL:</label>
                    <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="visibility">Visibility:</label>
                    <select
                        id="visibility"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <button type="submit">Shorten</button>
            </form>
            {error && <p className="error">{error}</p>}
            {shortenedUrl && (
                <p>
                    Shortened URL: <a href={shortenedUrl}>{shortenedUrl}</a>
                </p>
            )}
        </div>
    );
};

export default UrlShortenerForm;