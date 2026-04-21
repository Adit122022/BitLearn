import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatuses = ["Draft", "Published", "Archived"] as const;

export const courseCategories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "UI/UX Design",
  "Digital Marketing",
  "Business",
  "Finance",
  "Health",
  "Fitness",
  "Music",
  "Photography",
  "Video Editing",
  "Graphic Design",
  "Health & Fitness",
  "Teaching & Academics",
  "Other"
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" }),
  fileKey: z
    .string()
    .min(3, { message: "File Key must be at least 3 characters long" }),
  price: z.coerce
    .number()
    .min(1, { message: "Price must be at least 1 and a postive number" }),
  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1 hour" })
    .max(500, { message: "Duration must be at most 500 hours" }),
  level: z.enum(courseLevels, { message: "Please select a valid level" }),
  category: z.enum(courseCategories, { message: "Please select a valid category" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small Description must be at least 3 characters long" })
    .max(200, {
      message: "Small Description must be at most 200 characters long",
    }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" }),
  status: z.enum(courseStatuses, { message: "Please select a valid status" }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
