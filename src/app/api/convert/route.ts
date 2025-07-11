import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { SERVER_SETTINGS } from '../../../settings';
import { uploadToS3 } from '@/lib/uploadToS3';
import { z } from 'zod';
import type { ReadableStream as WebReadableStream } from 'node:stream/web'; // Import WebReadableStream type

const ZRequestSchema = z.object({
  prompt: z.string(),
});

const ZResponseSchema = z.object({
  videoUrl: z.string(),
});

const replicate = new Replicate({
  auth: SERVER_SETTINGS.replicateApiToken,
});



type ReplicateVideoOutput = string | string[] | ReadableStream;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { prompt } = ZRequestSchema.parse(body);
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
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate video' });
  }

  let videoUrl: string = '';

  try {
    const videoName = `${crypto.randomUUID()}.mp4`;

    videoUrl = await uploadToS3(output as WebReadableStream, videoName);
    ZResponseSchema.parse({ videoUrl });
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
