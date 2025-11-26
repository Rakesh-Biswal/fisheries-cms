import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
})

export async function uploadToR2(fileBuffer, key, contentType = "application/octet-stream") {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000", // Cache for 1 year
    })

    await r2Client.send(command)

    return {
      url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`,
      key: key,
    }
  } catch (error) {
    console.error("[v0] Cloudflare R2 upload error:", error)
    throw new Error(`Failed to upload file to R2: ${error.message}`)
  }
}

export async function deleteFromR2(key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    })

    await r2Client.send(command)
    console.log("[v0] Successfully deleted file from R2:", key)
  } catch (error) {
    console.error("[v0] Cloudflare R2 delete error:", error)
    throw new Error(`Failed to delete file from R2: ${error.message}`)
  }
}

export { r2Client }
