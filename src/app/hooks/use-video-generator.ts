import { useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';

const ZReplicateSchema = z.object({
  videoUrl: z.string(),
});

export function useVideoGenerator() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async (prompt: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || 'Failed to generate video';
        setError(errorMessage);
        toast.error(errorMessage);
        setVideoUrl(null);
        return;
      }

      if (data.error) {
        setError(data.error);
        toast.error(data.error);
        setVideoUrl(null);
        return;
      }

      const parsedData = ZReplicateSchema.parse(data);
      setVideoUrl(parsedData.videoUrl);
      toast.success('Video generated successfully!');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Error:', error);
      setError(errorMessage);
      toast.error(errorMessage);
      setVideoUrl(null);
    } finally {
      setLoading(false);
    }
  };

  return { generateVideo, videoUrl, loading, error };
}
