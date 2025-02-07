// s3Service.js
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // e.g. "us-east-1"
});

const BUCKET_NAME = 'gradflow-user-files';

/**
 * Create empty “folders” in S3 for a new user:
 *   userId/
 *   userId/cv/
 *   userId/cl/
 */
export async function createUserFoldersInS3(userId) {
  const basePrefix = `${userId}/`;    // e.g. "137/"
  const cvPrefix   = `${userId}/cv/`;
  const clPrefix   = `${userId}/cl/`;

  const prefixes = [basePrefix, cvPrefix, clPrefix];

  for (const prefix of prefixes) {
    await s3
      .putObject({
        Bucket: BUCKET_NAME,
        Key: prefix,
        Body: '', // empty content
      })
      .promise();
  }
}

export default s3;
