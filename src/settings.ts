import { z } from 'zod';

export const ZServerSettings = z.object({
  replicateApiToken: z.string(),
  region: z.string(),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
  destBucket: z.string(),
  endpoint: z.string(),
});

export const SERVER_SETTINGS = ZServerSettings.parse({
  replicateApiToken: process.env['REPLICATE_API_TOKEN'],
  region: process.env['AWS_REGION'],
  accessKeyId: process.env['ACCESS_KEY'],
  secretAccessKey: process.env['SECRET_ACCESS_KEY'],
  destBucket: process.env['DEST_BUCKET'],
  endpoint: process.env['S3_ENDPOINT'],
});
