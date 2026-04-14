const SAAVN_API = 'https://jiosaavn-api-privatecvc2.vercel.app';

export const searchMusic = async (query) => {
  try {
    const response = await fetch(`${SAAVN_API}/search/songs?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    if (data.status === 'SUCCESS' && data.data && data.data.results) {
      return data.data.results.map(item => {
        // Get highest quality download url available (usually 160kbps or 320kbps object)
        const bestAudio = item.downloadUrl ? item.downloadUrl[item.downloadUrl.length - 1].link : null;
        
        return {
          id: item.id,
          title: item.name,
          artist: item.primaryArtists,
          thumbnail: item.image && item.image.length > 0 ? item.image[item.image.length - 1].link : '',
          duration: parseInt(item.duration) || 0,
          streamUrl: bestAudio,
          views: parseInt(item.playCount) || 0
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
};

export const getTrending = async () => {
  // We use stable keywords for top hits and resolve them via Saavn to get their valid stream URLs.
  const hits = ['Tauba Tauba', 'Kesariya', 'Aayi Nai', 'Sajni', 'O Maahi', 'Heeriye'];
  const results = [];
  
  for (const hit of hits) {
    try {
      const res = await searchMusic(hit);
      if (res && res.length > 0) {
        results.push(res[0]); 
      }
    } catch(e) {}
  }
  return results;
};

export const getStreamUrl = async (trackId) => {
  // streamUrl is now resolved directly during search, but we keep this stub if AudioContext calls it.
  return null; 
};


