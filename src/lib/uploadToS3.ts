import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { SERVER_SETTINGS } from '@/settings';

const s3Client = new S3Client({
  region: SERVER_SETTINGS.region,
  credentials: {
    accessKeyId: SERVER_SETTINGS.accessKeyId!,
    secretAccessKey: SERVER_SETTINGS.secretAccessKey!,
  },
});

export async function uploadToS3(
  buffer: Buffer,
  fileName?: string
): Promise<string> {

  const key = fileName || `${crypto.randomUUID()}.mp4`;
  
  const command = new PutObjectCommand({
    Bucket: SERVER_SETTINGS.destBucket,
    Key: key,
    Body: buffer,
    ACL: 'public-read',
    ContentType:'video/mp4',
  });

  try {
    await s3Client.send(command);
    return `https://${SERVER_SETTINGS.destBucket}.s3.${SERVER_SETTINGS.region}.amazonaws.com/${key}`;

  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload to S3');
  }
}
