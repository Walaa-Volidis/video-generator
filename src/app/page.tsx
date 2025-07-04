import VideoGenerator from '@/components/VideoGenerator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            AI Video Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your ideas into stunning videos using artificial
            intelligence. Simply describe what you want to see, and our AI will
            create it for you.
          </p>
        </div>

        <VideoGenerator />
      </div>
    </div>
  );
}
