// Use 96kbps quality - this quality tier on Saavn's CDN is unencrypted
// and plays with full audio including vocals. Higher quality (160/320kbps)
// uses DRM encryption that browsers cannot decrypt, resulting in only
// background/instrumental audio playing.

const SAAVN_API = 'https://jiosaavn-api-privatecvc2.vercel.app';
const PREFERRED_QUALITY = '96kbps'; // DO NOT change - higher qualities are DRM encrypted

const mapSongItem = (item) => {
  // Extract download URLs
  const downloadUrls = item.downloadUrl || [];
  
  // Find highest quality unencrypted stream (96kbps is safe)
  // Fallback chain: 96kbps → 48kbps → 12kbps
  const qualities = ['96kbps', '48kbps', '12kbps'];
  let streamUrl = null;
  
  for (const q of qualities) {
    const found = downloadUrls.find(u => u.quality === q);
    if (found?.link) {
      streamUrl = found.link;
      break;
    }
  }

  // If none of those, take the first available one as last resort
  if (!streamUrl && downloadUrls.length > 0) {
    streamUrl = downloadUrls[0].link;
  }

  // Handle image structure variations
  let thumbnail = 'https://via.placeholder.com/300';
  if (Array.isArray(item.image) && item.image.length > 0) {
    thumbnail = item.image[item.image.length - 1].link;
  } else if (typeof item.image === 'string') {
    thumbnail = item.image;
  } else if (item.thumbnail) {
    thumbnail = item.thumbnail;
  }

  // Ensure HTTPS
  if (thumbnail.startsWith('http:')) {
    thumbnail = thumbnail.replace('http:', 'https:');
  }

  return {
    id: item.id,
    title: item.name?.replace(/&quot;/g, '"')?.replace(/&amp;/g, '&') || 'Unknown',
    artist: item.primaryArtists || 'Unknown Artist',
    thumbnail,
    duration: parseInt(item.duration) || 0,
    streamUrl,
    album: item.album?.name || '',
    year: item.year || '',
    playCount: parseInt(item.playCount) || 0
  };
};

export const searchMusic = async (query) => {
  try {
    const response = await fetch(
      `${SAAVN_API}/search/songs?query=${encodeURIComponent(query)}&limit=20`
    );
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();

    if (data.status === 'SUCCESS' && data.data?.results) {
      return data.data.results.map(mapSongItem);
    }
    return [];
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
};

export const getTrending = async () => {
  // Use specific album/artist searches so the first result is always the original
  // Include album name to avoid instrumentals/remixes being returned first
  const hits = [
    'Tauba Tauba Bad Newz Karan Aujla',
    'Kesariya Brahmastra Arijit Singh',
    'Aayi Nai AP Dhillon',
    'Sajni Jal The Band',
    'O Maahi Dunki Arijit Singh',
    'Heeriye Arijit Singh',
    'Tum Se Hi Jab We Met',
    'Raataan Lambiyan Shershaah',
  ];

  const results = [];

  for (const hit of hits) {
    try {
      const res = await searchMusic(hit);

      // Pick the first result that:
      // 1. Has a valid stream URL
      // 2. Is NOT an instrumental/remix/lofi (filter by name keywords)
      // 3. Has the HIGHEST play count (most popular = original version)
      const filtered = res.filter(song => {
        if (!song.streamUrl) return false;
        const lower = song.title.toLowerCase();
        const badKeywords = ['instrumental', 'karaoke', 'ringtone', 'bgm', 'background'];
        return !badKeywords.some(k => lower.includes(k));
      });

      // Sort by play count to get original version first
      const sorted = filtered.sort((a, b) => b.playCount - a.playCount);

      if (sorted.length > 0) {
        results.push(sorted[0]);
      }
    } catch (err) {
      console.error(`Failed to fetch: ${hit}`, err);
    }
  }

  return results;
};

export const getRecommendations = async (song) => {
  if (!song || !song.artist) return [];
  
  try {
    // Search for the primary artist to find similar/related tracks
    // Extracting first name or main artist to broaden the search if needed
    const mainArtist = song.artist.split(',')[0].trim();
    const results = await searchMusic(mainArtist);
    
    // Filter out the current song and ensure we have unique recommendations
    return results.filter(s => s.id !== song.id).slice(0, 10);
  } catch (error) {
    console.error('Failed to get recommendations:', error);
    return [];
  }
};

export const getStreamUrl = async () => null;
