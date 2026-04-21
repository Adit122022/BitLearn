# BitLearn - Complete Working Guide

This document provides a comprehensive step-by-step guide on how the BitLearn platform works from end-to-end, including how to set up your Administrator account.

---

## 🔑 1. How to Become an Admin

BitLearn uses `better-auth` for authentication, which defaults new signups to the `STUDENT` role for security. 
To gain full access to the Administrator panels (`/admin`), you need to manually upgrade your first account in the database.

### Step-by-Step Instructions:

1. **Sign Up:** Go to `http://localhost:3000/login` and create a new account using Email or Github.
2. **Access the Database:** Since you are using Prisma, the easiest way to edit your database is via Prisma Studio.
   - Open a new terminal.
   - Run: `npx prisma studio`
   - This will open a browser window at `http://localhost:5555`.
3. **Change Role:**
   - In Prisma Studio, click on the **User** model.
   - Find the row containing the account you just created.
   - Locate the `role` column. Double click the cell and change the value from `STUDENT` to `ADMIN`.
   - Click "Save 1 change" at the top of Prisma Studio.
4. **Log Back In:** 
   - Go back to your BitLearn Next.js application.
   - If you are already logged in, log out and log back in to refresh your `session.user.role` token.
   - You now have full Admin access!

---

## 🏫 2. Instructor Workflow (How to Teach)

If a user wants to upload courses, they must become a Teacher.

1. **Application:** A standard Student navigates to `/become-teacher` (available in the footer) and submits an application detailing their experience.
2. **Admin Review:** 
   - You (as the ADMIN) navigate to `/admin/teacher-applications` using the sidebar.
   - You will see the Pending application. Click **Approve**.
   - Upon approval, the user's role is automatically upgraded to `TEACHER`, and a `TeacherProfile` record is generated for them.
3. **Course Creation:**
   - The new Teacher navigates to `/admin/courses` and clicks **Create Course**.
   - They fill out the `CourseForm` which publishes an early draft.
4. **Curriculum Builder:**
   - After creating the course, the Teacher clicks **Modules** on their course card.
   - They create Sections (Modules) and attach Lessons.
   - For video lessons, they use the drag-and-drop S3 Video Uploader to upload massive video files directly to AWS.

---

## 📚 3. Student Workflow (How to Learn)

1. **Discovery:** The Student visits the public catalog at `/courses`. Currently, this page lists all courses that have their status set to Published (or Draft depending on your UI filters).
2. **Reviewing Content:** They click on a course to view the Landing Page (`/courses/[slug]`). This page previews what modules will be taught. Modules marked with the `Free Preview` toggle by the Teacher are visible here.
3. **Enrollment:** 
   - The student clicks **"Enroll Now"**. 
   - *(Note: Currently, this triggers a mock server action `enrollStudent`. In a production release, this button would redirect to Stripe Checkout, and Stripe Webhooks would create the Enrollment record).*
4. **Dashboard:** 
   - Post-enrollment, the student returns to `/dashboard` to view their active courses.
5. **Classroom Player:** 
   - Clicking "Resume Course" launches the `/classroom/[courseId]` environment.
   - The student can toggle between lessons using the sidebar.
   - The HTML5 player seamlessly streams the course videos from the AWS S3 Bucket.

---

## 🔒 4. Security & Middleware

- **`/admin/*`**: Strictly locked to `ADMIN` and `TEACHER` roles via Next.js Edge Middleware.
- **`/dashboard/*` & `/classroom/*`**: Requires an active session (user must be logged in).

Enjoy building on BitLearn! If you need to manipulate the platform rapidly for testing, running `npx prisma studio` is your best friend.
