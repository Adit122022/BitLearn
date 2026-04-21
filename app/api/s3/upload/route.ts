import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "@/lib/S3Client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { auth } from "@/lib/auth";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z.number().min(1, "File size is required"),
  isImage: z.boolean(),
  //    isPdf :z.boolean().optional(),
  //    isVideo :z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Request Body", details: validation.error },
        { status: 400 },
      );
    }

    const { fileName, fileType, fileSize, isImage } = validation.data;
    
    // Create a unique key for the file
    const uniqueFileName = `${uuidv4()}-${fileName.replace(/\s+/g, "_")}`;
    const fileKey = isImage ? `images/${uniqueFileName}` : `files/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: fileKey,
      ContentType: fileType,
      ContentLength: fileSize,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({ presignedUrl, fileKey }, { status: 200 });
  } catch (error) {
    console.error("S3 Presigned URL error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
