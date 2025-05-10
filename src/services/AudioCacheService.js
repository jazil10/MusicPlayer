const API_URL = process.env.REACT_APP_API_URL || 'https://musicbackend-nojm61ic.b4a.run/api';

class AudioCacheService {
  constructor() {
    this.cacheName = 'audio-cache';
    this.initializeCache();
  }

  async initializeCache() {
    if ('caches' in window) {
      try {
        await caches.open(this.cacheName);
      } catch (error) {
        console.error('Failed to initialize cache:', error);
      }
    }
  }

  async cacheAudio(videoId, audioBlob) {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.cacheName);
      const url = `${API_URL}/api/audio/${videoId}`;
      const response = new Response(audioBlob, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBlob.size.toString()
        }
      });
      await cache.put(url, response);
      console.log(`Cached audio for videoId: ${videoId}`);
    } catch (error) {
      console.error('Failed to cache audio:', error);
    }
  }

  async getCachedAudio(videoId) {
    if (!('caches' in window)) return null;

    try {
      const cache = await caches.open(this.cacheName);
      const url = `${API_URL}/api/audio/${videoId}`;
      const response = await cache.match(url);
      return response ? await response.blob() : null;
    } catch (error) {
      console.error('Failed to get cached audio:', error);
      return null;
    }
  }

  async isAudioCached(videoId) {
    if (!('caches' in window)) return false;

    try {
      const cache = await caches.open(this.cacheName);
      const url = `${API_URL}/api/audio/${videoId}`;
      const response = await cache.match(url);
      return !!response;
    } catch (error) {
      console.error('Failed to check if audio is cached:', error);
      return false;
    }
  }

  async clearCache() {
    if (!('caches' in window)) return;

    try {
      await caches.delete(this.cacheName);
      await this.initializeCache();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
}

export const audioCacheService = new AudioCacheService(); 