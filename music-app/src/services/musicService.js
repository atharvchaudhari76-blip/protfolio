const INVIDIOUS_INSTANCES = [
  'https://iv.ggtyler.dev',
  'https://inv.nadeko.net',
  'https://invidious.ducks.party',
  'https://invidious.sethforprivacy.com',
  'https://inv.zzls.xyz',
  'https://invidious.projectsegfau.lt'
];

export const searchMusic = async (query) => {
  // We try each instance until one works
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      console.log(`Searching via ${instance}...`);
      const response = await fetch(
        `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video`,
        { signal: AbortSignal.timeout(5000) } // 5s timeout per instance
      );
      
      if (!response.ok) continue;
      
      const data = await response.json();
      
      // Transform data to a standard format
      return data.map(item => ({
        id: item.videoId,
        title: item.title,
        artist: item.author,
        thumbnail: item.videoThumbnails?.find(t => t.quality === 'medium')?.url || item.videoThumbnails?.[0]?.url,
        duration: item.lengthSeconds,
        views: item.viewCount
      }));
    } catch (error) {
      console.warn(`Instance ${instance} failed:`, error.message);
      continue;
    }
  }
  throw new Error('All search instances failed. Please try again later.');
};

export const getTrending = async () => {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const response = await fetch(`${instance}/api/v1/trending?type=music`, {
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) continue;
      const data = await response.json();
      return data.slice(0, 15).map(item => ({
        id: item.videoId,
        title: item.title,
        artist: item.author,
        thumbnail: item.videoThumbnails?.find(t => t.quality === 'medium')?.url || item.videoThumbnails?.[0]?.url,
        duration: item.lengthSeconds,
        views: item.viewCount
      }));
    } catch (error) {
      continue;
    }
  }
  return [];
};

export const getStreamUrl = async (videoId) => {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const response = await fetch(`${instance}/api/v1/videos/${videoId}`, {
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) continue;
      
      const data = await response.json();
      
      // Look for adaptive formats (usually higher quality audio-only)
      const audioFormat = data.adaptiveFormats
        ?.filter(f => f.type.startsWith('audio/'))
        .sort((a, b) => (parseInt(b.bitrate) || 0) - (parseInt(a.bitrate) || 0))[0];
        
      if (audioFormat && audioFormat.url) {
        return audioFormat.url;
      }
      
      // Fallback to regular format streams
      const formatStream = data.formatStreams?.find(s => s.container === 'mp4' || s.container === 'webm');
      if (formatStream && formatStream.url) {
        return formatStream.url;
      }
    } catch (error) {
      continue;
    }
  }
  throw new Error('No playable stream found for this track.');
};

