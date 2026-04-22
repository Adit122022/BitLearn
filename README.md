# BitLearn - Next.js Full Stack LMS

BitLearn is a modern, full-stack Learning Management System (LMS) built with Next.js, Prisma, TailwindCSS, and AWS S3. It provides a complete end-to-end platform for instructors to create and sell video courses, and for students to discover, enroll in, and consume educational content.

## 🚀 Key Features

### Authentication & Authorization

- **Role-Based Access Control (RBAC):** Users are authenticated using `better-auth` and assigned strict roles (`user`, `admin`).
- **Middleware Protection:** Route access is strictly protected. Students are locked out of `/admin` creator studios, while unauthenticated users are redirected to login pages before viewing the `/dashboard` or `/classroom`.

### Instructor Tools (Teacher Studio)

- **Teacher Onboarding:** Users can dynamically apply to become instructors via the `/become-teacher` pipeline, which admins review via the `/admin/teacher-applications` dashboard.
- **Course Creation & Editing:** A rich WYSIWYG editor and intuitive form interface component (`CourseForm`) allows teachers to draft, price, categorize, and categorize their courses.
- **Curriculum Builder:** Teachers have access to an interactive drag-and-drop Curriculum Manager. They can define modules, toggle "free previews", and attach individual video lessons to their modules.
- **Direct S3 Uploads:** An integrated Drag-and-Drop Uploader requests secure, short-lived presigned URLs from the Next.js API, pushing multi-gigabyte video artifacts directly to AWS S3 without blocking the Node server.

### Student Experience

- **Interactive Catalog:** The public `/courses` route displays all published courses in a modern, responsive grid.
- **Landing Pages:** Beautiful detail pages (`/courses/[slug]`) breakdown the course curriculum, instructor bio, and pricing, with an integrated "Enroll" workflow.
- **Student Dashboard:** Track enrolled courses and learning progress seamlessly.
- **Classroom Player:** An immersive HTML5 Video Player (`/classroom/[courseId]`) streams course content directly from S3. It includes a collapsing sidebar that tracks the user's active module and lesson synchronicity.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Database:** PostgreSQL (Neon) via **Prisma ORM**
- **Authentication:** Better-Auth (with specialized Admin plugins for RBAC)
- **Storage:** AWS S3 (Using Presigned URLs via `@aws-sdk/client-s3`)
- **Styling:** TailwindCSS v4 with Shadcn UI Components
- **Forms & Validation:** React Hook Form + Zod + Sonner Toast Notifications

## 📂 Project Structure Highlights

- `app/actions/`: Encapsulated server actions handling DB mutations (courses, modules, enrollment, teacher applications).
- `app/admin/`: Protected admin and teacher routes for course management.
- `app/classroom/`: The core video player environment for enrolled students.
- `app/api/s3/upload/`: Secure endpoint handling file metadata and authorizing pre-signed S3 PUT URLs.
- `components/forms/CourseForm.tsx`: The primary reusable form logic abstracting complex validation.

## 🚀 Getting Started

1. Set up your `.env` with your Neon database URL, Better-Auth secrets, and AWS IAM Keys (S3 Bucket).
2. Run database synchronization:
   ```bash
   npx prisma db push
   ```
3. Start the development server:
   ```bash
   pnpm run dev
   ```

## 📝 Roadmap / Future Additions

- **Real Payment Processing:** Replace the mock enrollment system with Stripe/Razorpay webhooks.
- **Progress Tracking:** Connect the classroom sidebar markers directly to database "completed" states.
- **Analytics Dashboard:** Build out the admin `/analytics` routes to show instructor revenue and student engagement metrics.
