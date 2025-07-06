'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Play, Download } from 'lucide-react';
import { useVideoGenerator } from '@/app/hooks/use-video-generator';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const { generateVideo, loading, videoUrl } = useVideoGenerator();

  const handleDownload = async () => {
    if (!videoUrl) return;

    setIsDownloading(true);
    try {
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-video-${Date.now()}.mp4`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `ai-video-${Date.now()}.mp4`;
      link.target = '_blank';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <Card className="border-2 border-purple-200 dark:border-purple-700 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r text-purple rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-2xl">
            <Play className="w-6 h-6 text-purple-700 dark:text-purple-300" />
            AI Video Generator
          </CardTitle>
          <CardDescription className="text-purple-700 dark:text-purple-300 text-lg">
            Enter a prompt to generate a video using AI. Describe what you want
            to see in the video.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <label
              htmlFor="prompt"
              className="text-lg font-medium text-purple-700 dark:text-purple-300"
            >
              Video Prompt
            </label>
            <Textarea
              id="prompt"
              placeholder="A cat playing with a ball of yarn in slow motion..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-lg"
              disabled={loading}
            />
          </div>

          <Button
            onClick={() => generateVideo(prompt)}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Video...
              </>
            ) : (
              'Generate Video'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Video Display Section */}
      {videoUrl && (
        <Card className="border-2 border-green-200 dark:border-green-700 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r text-purple-700 dark:text-purple-300 rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-2xl">
              Generated Video
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-2 bg-white/20 border-white/30 text-purple-700 dark:text-purple-300 hover:bg-white/30 text-base disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 shadow-inner">
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-contain"
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-lg text-blue-600 dark:text-blue-400 mt-2 font-medium">
              Prompt: &ldquo;{prompt}&rdquo;
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="border-2 border-orange-200 dark:border-orange-700 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text" />
                <div className="absolute inset-0 w-12 h-12 mx-auto border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
              <div>
                <p className="text-2xl font-medium bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Generating your video...
                </p>
                <p className="text-lg text-orange-600 dark:text-orange-400">
                  This may take a few minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoGenerator;
