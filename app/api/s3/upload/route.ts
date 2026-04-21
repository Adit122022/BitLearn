import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "@/lib/S3Client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { auth } from "@/lib/auth";

// Schema is defined inline (not exported) — Next.js route files may only
// export HTTP method handlers (GET, POST, etc.) and Route Segment Configs.
const fileUploadSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z.number().min(1, "File size is required"),
  isImage: z.boolean(),
  courseName: z.string().optional(),
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

    const { fileName, fileType, fileSize, isImage, courseName } = validation.data;
    
    // Create a unique key for the file
    const uniqueFileName = `${uuidv4()}-${fileName.replace(/\s+/g, "_")}`;
    const cleanCourseName = courseName ? courseName.replace(/[^a-zA-Z0-9]/g, "_") : "general";
    const baseFolder = `${session.user.id}/${cleanCourseName}`;
    const fileKey = isImage ? `${baseFolder}/images/${uniqueFileName}` : `${baseFolder}/videos/${uniqueFileName}`;

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
