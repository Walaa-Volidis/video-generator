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
  const { generateVideo, loading, videoUrl } = useVideoGenerator();

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'generated-video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            AI Video Generator
          </CardTitle>
          <CardDescription>
            Enter a prompt to generate a video using AI. Describe what you want
            to see in the video.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Video Prompt
            </label>
            <Textarea
              id="prompt"
              placeholder="A cat playing with a ball of yarn in slow motion..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
              disabled={loading}
            />
          </div>

          <Button
            onClick={() => generateVideo(prompt)}
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Video
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-contain"
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Prompt: &ldquo;{prompt}&rdquo;
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <div>
                <p className="text-lg font-medium">Generating your video...</p>
                <p className="text-sm text-gray-600">
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
