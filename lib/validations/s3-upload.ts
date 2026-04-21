import z from "zod";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z.number().min(1, "File size is required"),
  isImage: z.boolean(),
  courseName: z.string().optional(),
});
