import { createShortUrl, getShortUrl } from '../../lib/urlService';

describe('URL Shortener', () => {
  it('should create a shortened URL', async () => {
    const originalUrl = 'https://example.com';
    const shortUrl = await createShortUrl(originalUrl);
    
    expect(shortUrl).toBeDefined();
    expect(shortUrl).toMatch(/^[a-zA-Z0-9]{6}$/); // Assuming the short URL is 6 characters long
  });

  it('should retrieve the original URL from a shortened URL', async () => {
    const originalUrl = 'https://example.com';
    const shortUrl = await createShortUrl(originalUrl);
    const retrievedUrl = await getShortUrl(shortUrl);
    
    expect(retrievedUrl).toEqual(originalUrl);
  });

  it('should return null for a non-existent shortened URL', async () => {
    const retrievedUrl = await getShortUrl('nonexistent');
    
    expect(retrievedUrl).toBeNull();
  });
});