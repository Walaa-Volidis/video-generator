import { useState } from 'react';
import { z } from 'zod';
const ZReplicateSchema = z.object({
  videoUrl: z.string(),
});

export function useVideoGenerator() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const generateVideo = async (prompt: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate image');

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      const parsedData = ZReplicateSchema.parse(data);
      setVideoUrl(parsedData.videoUrl);
    } catch (error) {
      console.error('Error:', error);
      setVideoUrl(null);
    } finally {
      setLoading(false);
    }
  };
  return { generateVideo, videoUrl, loading };
}
