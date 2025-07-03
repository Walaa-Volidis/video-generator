import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { SERVER_SETTINGS } from '../../../settings';
import { uploadToS3 } from '@/lib/uploadToS3';

const replicate = new Replicate({
  auth: SERVER_SETTINGS.replicateApiToken,
});

async function streamToBuffer(
  stream: ReadableStream<Uint8Array>
): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) chunks.push(value);
    done = readerDone;
  }

  return Buffer.concat(chunks);
}

type ReplicateVideoOutput = string | string[] | ReadableStream;

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  const input = {
    fps: 24,
    prompt,
    duration: 5,
    resolution: '720p',
    aspect_ratio: '16:9',
    camera_fixed: false,
  };

  let output: ReplicateVideoOutput;
  try {
    output = (await replicate.run('bytedance/seedance-1-lite', {
      input,
    })) as ReplicateVideoOutput;
    console.log('output', output);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate video' });
  }

  let videoUrl: string = '';
  console.log('output', output);

  try {
    let buffer: Buffer;

    if (output instanceof ReadableStream) {
      // Handle ReadableStream directly
      buffer = await streamToBuffer(output);
    } else if (Array.isArray(output) && output.length > 0) {
      // Handle array of URLs
      const videoResponse = await fetch(output[0]);
      if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
      }
      const videoStream = videoResponse.body as ReadableStream;
      buffer = await streamToBuffer(videoStream);
    } else if (typeof output === 'string') {
      // Handle single URL
      const videoResponse = await fetch(output);
      if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
      }
      const videoStream = videoResponse.body as ReadableStream;
      buffer = await streamToBuffer(videoStream);
    } else {
      return NextResponse.json({
        error: 'Invalid output format from Replicate API',
      });
    }

    const videoName = `${crypto.randomUUID()}.mp4`;
    console.log('videoName', videoName);

    videoUrl = await uploadToS3(buffer, videoName);
  } catch (error) {
    console.error('Error processing/uploading video:', error);
    return NextResponse.json({
      error: 'Failed to process and upload video to S3',
    });
  }

  return NextResponse.json({
    message: 'Video generated and uploaded successfully',
    videoUrl,
  });
}
