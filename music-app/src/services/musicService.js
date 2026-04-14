const INVIDIOUS_INSTANCES = [
  'https://iv.ggtyler.dev',
  'https://inv.nadeko.net',
  'https://invidious.ducks.party',
  'https://invidious.sethforprivacy.com',
  'https://inv.zzls.xyz',
  'https://invidious.projectsegfau.lt'
];

export const searchMusic = async (query) => {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      // Searching for "{query} topic" finds the official audio-only versions
      // these are unrestricted for embedding and have studio quality.
      const searchQuery = `${query} topic`;

      const response = await fetch(
        `${instance}/api/v1/search?q=${encodeURIComponent(searchQuery)}&type=video`,
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (!response.ok) continue;
      
      const data = await response.json();
      
      return data.map(item => ({
        id: item.videoId,
        title: item.title.replace(' - Topic', '').replace(' (Official Audio)', ''),
        artist: item.author.replace(' - Topic', ''),
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

export const getTrending = async () => {
  // Stable trending list for Bollywood & Global hits
  return [
    { id: 'h7GyP0Spx3o', title: 'Aayi Nai', artist: 'Pawan Singh', thumbnail: 'https://img.youtube.com/vi/h7GyP0Spx3o/mqdefault.jpg' },
    { id: '6S6pivkYyVY', title: 'Kesariya', artist: 'Arijit Singh', thumbnail: 'https://img.youtube.com/vi/6S6pivkYyVY/mqdefault.jpg' },
    { id: 'T94PHkuydcw', title: 'Heeriye', artist: 'Arijit Singh', thumbnail: 'https://img.youtube.com/vi/T94PHkuydcw/mqdefault.jpg' },
    { id: 'KUpwndQ0_8k', title: 'Sajni', artist: 'Arijit Singh', thumbnail: 'https://img.youtube.com/vi/KUpwndQ0_8k/mqdefault.jpg' },
    { id: '407Y7_nKntU', title: 'Tauba Tauba', artist: 'Karan Aujla', thumbnail: 'https://img.youtube.com/vi/407Y7_nKntU/mqdefault.jpg' },
    { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg' }
  ];
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

