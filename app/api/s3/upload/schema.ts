import z from "zod";

/**
 * Schema for validating S3 pre-signed upload request body.
 * Kept in a separate file because Next.js App Router route files
 * only allow HTTP method exports (GET, POST, etc.) and Route Segment Configs.
 */
export const fileUploadSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z.number().min(1, "File size is required"),
  isImage: z.boolean(),
  courseName: z.string().optional(),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;
