import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { SERVER_SETTINGS } from '@/settings';
import { Readable } from 'stream';
import type { ReadableStream as WebReadableStream } from 'node:stream/web';

const s3Client = new S3Client({
  region: SERVER_SETTINGS.region,
  credentials: {
    accessKeyId: SERVER_SETTINGS.accessKeyId!,
    secretAccessKey: SERVER_SETTINGS.secretAccessKey!,
  },
});

export async function uploadToS3(
  stream: WebReadableStream,
  fileName?: string
): Promise<string> {
  const key = fileName || `${crypto.randomUUID()}.mp4`;

  const nodeReadableStream = Readable.fromWeb(stream);

  try {
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: SERVER_SETTINGS.destBucket,
        Key: key,
        Body: nodeReadableStream,
        ACL: 'public-read',
        ContentType: 'video/mp4',
      },
    });

    parallelUploads3.on('httpUploadProgress', (progress) => {
      console.log(
        `Upload progress: ${progress.loaded} of ${
          progress.total || 'unknown'
        } bytes`
      );
    });

    await parallelUploads3.done();

    return `https://${SERVER_SETTINGS.destBucket}.s3.${SERVER_SETTINGS.region}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('S3 upload error (using lib-storage Upload):', error);
    throw new Error(`Failed to upload to S3: ${(error as Error).message}`);
  }
}
