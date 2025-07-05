import VideoGenerator from '@/components/VideoGenerator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4 float-animation">
            Video Generator
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into stunning videos using Replicate AI. Simply describe what you want to see, and our AI will
            create it for you with vibrant colors and amazing effects.
          </p>
        </div>

        <VideoGenerator />
      </div>
    </div>
  );
}
