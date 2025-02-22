// s3Service.js
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // e.g. "us-east-1"
});

const BUCKET_NAME = process.env.BUCKET_NAME;

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


/**
 * Delete all objects under a user's prefix (e.g. "userId/").
 * This is optional, but can be handy if you want a bulk delete approach.
 */
export async function deleteAllObjectsForUser(userId) {
  const prefix = `${userId}/`; // e.g. "123/"

  // 1) List all objects with this prefix
  const listResult = await s3
    .listObjectsV2({
      Bucket: BUCKET_NAME,
      Prefix: prefix
    })
    .promise();

  if (!listResult.Contents.length) {
    return; // No objects, nothing to delete
  }

  // 2) Build an array of { Key: '...' } for each object
  const Objects = listResult.Contents.map((obj) => ({ Key: obj.Key }));

  // 3) Delete them in a single bulk request
  await s3
    .deleteObjects({
      Bucket: BUCKET_NAME,
      Delete: { Objects }
    })
    .promise();
}
