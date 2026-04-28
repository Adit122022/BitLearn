# BitLearn - Modern Full Stack LMS Platform

![BitLearn](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![React](https://img.shields.io/badge/React-19-blue?logo=react) ![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss) ![Razorpay](https://img.shields.io/badge/Razorpay-Payments-5296D8)

BitLearn is a modern, scalable Learning Management System (LMS) platform built with cutting-edge technologies. It enables instructors to create, manage, and monetize courses while providing students with an interactive learning experience. The platform includes a complete payment gateway integration with Razorpay, comprehensive admin dashboards, and role-based access control.

---

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & HLD](#-architecture--hld)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [User Guide](#-user-guide)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Key Features

### 👥 Authentication & Authorization
- **Better-Auth Integration:** Secure authentication with Google, GitHub, and email
- **Role-Based Access Control (RBAC):** Four distinct user roles:
  - `STUDENT`: Access to courses and learning dashboard
  - `TEACHER`: Create and manage courses
  - `ADMIN`: Platform-wide management and analytics
  - `UNIVERSITY_ADMIN`: Manage university-specific courses and teachers
- **Protected Routes:** Automatic redirects based on user roles and authentication status

### 🎓 Student Features
- **Course Discovery:** Browse published courses in an interactive grid
- **Instant Enrollment:** One-click enrollment with Razorpay payment integration
- **Interactive Classroom:** 
  - HTML5 video player with adaptive streaming from AWS S3
  - Module/lesson navigation sidebar
  - Progress tracking
  - Responsive design optimized for mobile
- **Student Dashboard:** Track enrolled courses, progress, and notifications
- **Inbox System:** Receive notifications for course assignments and university invites

### 👨‍🏫 Teacher Features
- **Teacher Studio:** Complete course management interface
- **Course Builder:**
  - WYSIWYG editor for course descriptions
  - Module creation with drag-and-drop reordering
  - Lesson management with video attachments
  - Price configuration (free or paid courses)
  - Course categorization and metadata
- **Video Upload:**
  - Direct S3 upload with presigned URLs
  - Support for large video files
  - No server-side processing bottlenecks
- **Student Management:** View enrolled students and send notifications
- **Analytics:** Track course performance and student engagement

### 🛡️ Admin Dashboard Features
- **System Overview:** Platform statistics (total users, courses, revenue, etc.)
- **Course Management:** View all courses, manage course status
- **Student Management:**
  - View all enrollments across courses
  - Revoke student access with confirmation dialog
  - Track enrollment dates and payment amounts
- **Teacher Applications:** Review and approve teacher applications
- **User Management:** Monitor users and their roles
- **Transparency Dashboard:**
  - Complete university listing with metrics
  - Teacher directory with course assignments
  - User verification status tracking
- **Analytics Dashboard:** Revenue tracking, enrollment trends, and platform metrics

### 🏫 University Management
- **University Admin Features:**
  - Create and manage university-specific courses
  - Assign teachers to courses
  - Manage university team members
  - View university analytics and revenue
- **Student Visibility:** Students enrolled through university see university context

### 💳 Payment Integration
- **Razorpay Integration:**
  - Test and production mode support
  - Order creation and verification
  - HMAC-SHA256 signature validation
  - Secure payment flow
  - Automatic enrollment upon successful payment
- **Payment Tracking:** Monitor all transactions and payment status
- **Refund Support:** Mark payments as refundable with proper tracking

### 📱 Responsive Design
- **Mobile-First Approach:** Optimized for all screen sizes
- **Hamburger Navigation:** Full-screen mobile menu overlay
- **Touch-Friendly:** Large buttons and adequate spacing
- **Dark Mode:** Theme toggle for better user experience

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router, Turbopack)
- **UI Library:** React 19
- **Styling:** TailwindCSS 4 + Shadcn UI Components
- **Form Management:** React Hook Form + Zod Validation
- **State Management:** React Context + Custom Hooks
- **Notifications:** Sonner Toast Library
- **Icons:** Tabler Icons + Lucide Icons
- **Date Handling:** Native JavaScript Date API

### Backend
- **Runtime:** Node.js (Next.js Server Actions)
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **Authentication:** Better-Auth with custom plugins
- **File Storage:** AWS S3 with presigned URLs
- **Email:** Resend for transactional emails
- **Security:** ArcJet for rate limiting & protection
- **Validation:** Zod for type-safe validation

### DevOps & Deployment
- **Hosting:** Vercel (production)
- **Package Manager:** pnpm
- **Version Control:** Git with conventional commits
- **CI/CD:** Vercel auto-deployment from git

---

## 🏗 Architecture & HLD

### High-Level Design (HLD)

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Students   │  │   Teachers   │  │    Admins    │          │
│  │    (Web)     │  │    (Web)     │  │    (Web)     │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           │                                      │
│                    React Components                             │
│                  (Next.js App Router)                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    NEXT.JS SERVER LAYER                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              SERVER ACTIONS & API ROUTES                │  │
│  │                                                          │  │
│  │  • Authentication (Better-Auth)                         │  │
│  │  • Course Management (CRUD)                             │  │
│  │  • Enrollment & Payment                                 │  │
│  │  • Teacher Applications                                 │  │
│  │  • Admin Operations                                     │  │
│  │  • Notifications                                        │  │
│  │  • AWS S3 Presigned URLs                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────┬─────────────────────────────┬──────────────────────┘
            │                             │
    ┌───────▼──────────┐        ┌────────▼──────────┐
    │                  │        │                   │
┌───▼──────────────┐  │   ┌────▼────────────────┐  │
│                  │  │   │                     │  │
│   PostgreSQL     │  │   │   AWS Services      │  │
│   (Neon)         │  │   │                     │  │
│                  │  │   │ • S3 (Videos)      │  │
│  • Users         │  │   │ • CloudFront       │  │
│  • Courses       │  │   │ • IAM              │  │
│  • Modules       │  │   └─────────────────────┘  │
│  • Lessons       │  │                             │
│  • Enrollments   │  │   ┌────────────────────┐   │
│  • Payments      │  │   │ External Services  │   │
│  • Payments      │  │   │                    │   │
│  • Notifications │  │   │ • Razorpay         │   │
│  • Verification  │  │   │ • Resend (Email)   │   │
│  • Applications  │  │   │ • ArcJet (Security)│   │
│                  │  │   └────────────────────┘   │
└───────────────────┘  └─────────────────────────────┘

```

### Data Flow

#### Course Enrollment & Payment Flow
```
Student Views Course → Clicks "Enroll" Button
        ↓
Client: createPaymentOrder(courseId)
        ↓
Server: 
  1. Verify user is authenticated
  2. Check course exists & is published
  3. Verify no existing enrollment
  4. Create Razorpay Order
  5. Store Payment record (PENDING)
        ↓
Client: Display Razorpay Checkout
        ↓
Student: Complete Payment
        ↓
Razorpay: Return payment details
        ↓
Client: verifyPayment()
        ↓
Server:
  1. Verify HMAC signature
  2. Check payment record exists
  3. Create Enrollment
  4. Mark Payment as SUCCESS
  5. Revalidate cache
        ↓
Student: Enrolled! Access to classroom
```

#### Teacher Invitation & Course Assignment Flow
```
University Admin Sends Invite → selectUser & Course
        ↓
Server Actions:
  1. Verify admin authorization
  2. Create notification for user
  3. Send email invitation
  4. Assign course to teacher (update userId)
        ↓
Teacher: Receives email & notification
        ↓
Teacher: Accepts invitation
        ↓
Server: Update universityTeacher record, update user role to TEACHER
        ↓
Teacher: Can now manage assigned courses
```

### Database Schema (Key Entities)

```
User
├── id (UUID)
├── email (String, unique)
├── name (String)
├── role (STUDENT | TEACHER | ADMIN | UNIVERSITY_ADMIN)
├── image (String, optional)
└── emailVerified (Boolean)

Course
├── id (UUID)
├── title (String)
├── description (Text, rich editor)
├── slug (String, unique)
├── price (Int) - in paisa (₹)
├── userId (FK: User)
├── universityId (FK: University, optional)
├── status (DRAFT | PUBLISHED | ARCHIVED)
├── imageUrl (String)
└── createdAt, updatedAt

Module
├── id (UUID)
├── courseId (FK: Course)
├── title (String)
├── order (Int)
└── isFreePreview (Boolean)

Lesson
├── id (UUID)
├── moduleId (FK: Module)
├── title (String)
├── videoUrl (String) - AWS S3 URL
├── duration (Int) - seconds
├── order (Int)
└── isFreePreview (Boolean)

Enrollment
├── id (UUID)
├── userId (FK: User)
├── courseId (FK: Course)
├── amount (Int) - amount paid
├── paidAt (DateTime)
└── createdAt

Payment
├── id (UUID)
├── userId (FK: User)
├── courseId (FK: Course)
├── razorpayOrderId (String)
├── razorpayPaymentId (String, optional)
├── amount (Int)
├── status (PENDING | SUCCESS | FAILED | REFUNDED)
├── enrollmentId (FK: Enrollment, optional)
└── createdAt, updatedAt

University
├── id (UUID)
├── name (String)
├── email (String)
├── logo (String, optional)
└── createdAt

UniversityAdmin
├── userId (FK: User)
├── universityId (FK: University)
└── createdAt

Notification
├── id (UUID)
├── type (UNIVERSITY_INVITE | COURSE_ASSIGNMENT)
├── title (String)
├── message (Text)
├── senderId (FK: User)
├── receiverId (FK: User)
├── universityId (FK: University, optional)
├── courseId (FK: Course, optional)
├── status (PENDING | READ | ACCEPTED | REJECTED)
└── createdAt
```

---

## 📂 Project Structure

```
BitLearn/
├── app/
│   ├── (auth)/                    # Authentication routes (login, signup)
│   ├── (public)/                  # Public routes
│   │   ├── courses/               # Course listing & details
│   │   ├── become-teacher/        # Teacher application
│   │   ├── request-university/    # University request form
│   │   ├── contact/               # Contact page
│   │   └── _components/
│   │       ├── NavBar.tsx         # Main navigation (responsive)
│   │       ├── Footer.tsx         # Footer component
│   │       └── ...
│   ├── admin/                     # Admin-only routes (protected)
│   │   ├── page.tsx               # Admin dashboard
│   │   ├── analytics/             # Analytics dashboard
│   │   ├── courses/               # Course management
│   │   │   └── enrollments/       # Student enrollments & revoke
│   │   ├── teacher-applications/  # Approve teachers
│   │   ├── users/                 # User management
│   │   ├── universities/          # University management
│   │   └── transparency/          # Transparency dashboard
│   ├── university/                # University admin routes
│   │   ├── dashboard/             # University dashboard
│   │   ├── courses/               # University courses
│   │   └── teachers/              # University teachers
│   ├── dashboard/                 # Student dashboard
│   ├── classroom/                 # Video player & learning
│   ├── inbox/                     # Notifications
│   ├── actions/                   # Server actions (business logic)
│   │   ├── payment-actions.ts     # Razorpay integration
│   │   ├── admin-enrollment-actions.ts
│   │   ├── notification-actions.ts
│   │   └── ...
│   ├── api/                       # API routes
│   │   ├── s3/upload/             # S3 presigned URL endpoint
│   │   └── auth/                  # Authentication routes
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
│
├── components/
│   ├── ui/                        # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── forms/
│   │   ├── CourseForm.tsx         # Reusable course form
│   │   └── ...
│   ├── sidebar/
│   │   ├── app-sidebar.tsx        # Admin sidebar navigation
│   │   └── ...
│   └── ...
│
├── lib/
│   ├── db.ts                      # Prisma client
│   ├── env.ts                     # Environment variables (validated)
│   ├── auth.ts                    # Better-Auth configuration
│   ├── auth-client.ts             # Client-side auth
│   ├── s3.ts                      # AWS S3 utilities
│   └── ...
│
├── hooks/
│   ├── use-signout.ts             # Logout hook
│   └── ...
│
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
│
├── public/
│   ├── Logo.png                   # Brand logo
│   └── ...
│
├── .env                           # Environment variables (local)
├── .env.example                   # Environment variables template
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind configuration
├── package.json                   # Dependencies
├── pnpm-lock.yaml                 # Dependency lock file
└── README.md                       # This file
```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ or 20+
- pnpm (recommended) or npm/yarn
- PostgreSQL (Neon cloud DB recommended)
- AWS account with S3 bucket
- Razorpay account (for payments)
- Google OAuth credentials
- GitHub OAuth credentials
- Resend account (for emails)

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/bitlearn.git
cd BitLearn
```

### Step 2: Install Dependencies
```bash
pnpm install
# or
npm install
```

### Step 3: Setup Environment Variables
Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

### Step 4: Configure Database
```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# (Optional) Open Prisma Studio
npx prisma studio
```

### Step 5: Run Development Server
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

### Database
```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

### Authentication (Better-Auth)
```env
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

Auth_Github_Client_Id="from-github-oauth"
Auth_Github_Secret="from-github-oauth"

Auth_GOOGLE_CLIENT_ID="from-google-oauth"
Auth_GOOGLE_CLIENT_SECRET="from-google-oauth"
```

### AWS S3
```env
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="auto"
AWS_ENDPOINT_URL_S3="https://your-endpoint"
AWS_ENDPOINT_URL_IAM="https://your-iam-endpoint"

NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES="your-bucket-name"
```

### Payment Gateway (Razorpay)
```env
RAZORPAY_KEY_ID="rzp_test_xxxxx"          # Test mode key
RAZORPAY_KEY_SECRET="xxxxx"               # Test mode secret
```

### Email Service (Resend)
```env
RESEND_API_KEY="re_xxxxx"
RESEND_DOMAIN="noreply.yourdomain.com"    # Optional, uses default if not set
```

### Security
```env
ARCJET_KEY="ajkey_xxxxx"
ARCJET_ENV="development"                  # or "production"
```

### Public URLs
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # For local: http://localhost:3000
                                              # For production: https://yourdomain.com
```

---

## 👥 User Guide

### For Students

#### Discovering Courses
1. Navigate to **Courses** from the main navigation
2. Browse published courses in the grid view
3. Click on any course to view details including:
   - Course description and curriculum
   - Instructor information
   - Pricing
   - Student reviews (if available)

#### Enrolling in a Course
1. On course details page, click **"Enroll for ₹X"** button
2. You'll be redirected to **Razorpay checkout**
3. Enter your payment details or use existing cards
4. Upon successful payment, you'll be automatically enrolled
5. Access the course immediately from your **Dashboard**

#### Learning & Classroom
1. Go to **Dashboard** → **My Learning**
2. Click on an enrolled course
3. You'll enter the **Classroom** with:
   - **Video player** (responsive, works on mobile)
   - **Module sidebar** (collapsible)
   - **Lesson navigation**
   - **Progress tracking**
4. Click next lesson or use sidebar to navigate

#### Inbox & Notifications
1. Click **Inbox** in the navigation
2. View pending and read notifications
3. Notifications include:
   - Course assignment invites
   - University invites
   - Administrative messages
4. Mark as read or accept/reject invites

---

### For Teachers

#### Applying to Become a Teacher
1. From public pages, click **"Become a Teacher"**
2. Fill out the teacher application form
3. Submit for admin review
4. Admins will approve/reject (you'll receive email notification)

#### Creating a Course
1. Login and go to **Teacher Studio** (in dropdown menu)
2. Click **"Create New Course"**
3. Fill in course details:
   - **Title**: Course name
   - **Description**: Rich text editor (supports formatting)
   - **Price**: In rupees (₹). Set to 0 for free courses
   - **Category**: Select course category
   - **Image**: Upload course thumbnail
4. Save as **DRAFT** to continue later

#### Building Curriculum
1. In course editor, go to **Curriculum** section
2. **Add Module**: Click "Add Module", name it (e.g., "Introduction", "Advanced Topics")
3. **Reorder Modules**: Drag and drop to rearrange
4. **Add Lessons** to modules:
   - Click "Add Lesson" in module
   - Enter lesson title
   - Upload video from your computer (direct S3 upload)
   - Videos are processed securely without server bottlenecks
5. **Mark Free Preview**: Toggle "Free Preview" on lessons to preview publicly
6. Save and publish when ready

#### Publishing a Course
1. Review all course details
2. Click **"Publish"** button
3. Course becomes visible to all students
4. Can still edit content after publishing

#### Managing Students
1. In Teacher Studio, click on your course
2. Go to **"Students"** tab
3. View all enrolled students:
   - Student name and email
   - Enrollment date
   - Amount paid
4. Use **"Revoke Access"** to remove a student (with confirmation)

#### University Teacher Role
If invited to teach for a university:
1. You'll receive **invitation notification** in Inbox
2. Click **"Accept Invitation"**
3. Your role changes to **TEACHER** (if was STUDENT)
4. You can now manage university-assigned courses

---

### For Admins

#### Admin Dashboard Overview
Access at `/admin` (visible only if user role is ADMIN)

**Key Sections:**

##### 1. Dashboard (Home)
- **Quick Stats**: Total users, teachers, courses, revenue
- **Recent Activity**: Latest enrollments, courses, applications

##### 2. Course Enrollments
Navigate to **Enrollments** in sidebar

**Features:**
- View all published courses
- For each course, see:
  - Number of enrolled students
  - Student details (name, email, role, amount paid, date)
  - **Revoke Access button** with confirmation dialog
- Student can be removed from course anytime
- Revalidates cache immediately upon revoke

**Example Flow:**
1. Admin sees student enrolled in course
2. Clicks **"Revoke"** button
3. Confirmation dialog appears
4. On confirmation, enrollment is deleted
5. Student loses immediate access to course
6. Success toast notification shows

##### 3. Analytics Dashboard
Navigate to **Analytics** in sidebar

**Displays:**
- Total platform users (students, teachers, admins)
- Total published courses
- Total enrollments across platform
- Total revenue from all payments

##### 4. Teacher Applications
Navigate to **Teacher Applications** in sidebar

**Manage Applications:**
- View pending teacher applications
- See applicant details and application date
- Approve → User becomes TEACHER role
- Reject → Application is removed

##### 5. User Management
Navigate to **User Management** in sidebar

**View Users:**
- Complete user listing
- See user role (STUDENT, TEACHER, ADMIN, UNIVERSITY_ADMIN)
- Email and verification status
- Registration date

##### 6. Universities
Navigate to **Universities** in sidebar

**Manage Universities:**
- View all registered universities
- University details:
  - Name and contact email
  - Logo
  - Number of courses
  - Number of admins
  - Number of teachers
- Create new university (with form)

##### 7. Transparency Dashboard
Navigate to **Transparency** in sidebar

**Three Tabs:**

**A. Universities View**
- Complete list of all universities
- Metrics for each:
  - Number of courses
  - Number of teachers
  - Number of admins
  - Total students enrolled

**B. Teachers Directory**
- All teachers on platform
- For each teacher:
  - Name and email
  - Number of courses created
  - Total enrollments across their courses
  - Courses they teach

**C. Users View**
- Complete user directory
- Filter by role
- See verification status
- Email addresses for communication

---

### For University Admins

#### University Dashboard
Access at `/university/dashboard` (visible if user is UNIVERSITY_ADMIN)

**Key Sections:**

##### 1. Overview
- University statistics:
  - Number of courses
  - Number of teachers
  - Total enrollments
  - Total revenue

##### 2. Manage Courses
- View university-specific courses
- Create new courses for university
- Edit course details
- Manage course status
- View course enrollments

##### 3. Manage Teachers
- View all university teachers
- **Invite Teachers**:
  1. Enter teacher email
  2. Select role/subject (optional)
  3. System sends invitation email
  4. Teacher receives notification
  5. Teacher accepts in Inbox
  6. Teacher is added to university team

- **Assign Courses**:
  1. Select teacher
  2. Select course
  3. Send assignment notification
  4. Teacher can now manage course

##### 4. University Analytics
- Revenue tracking for university
- Enrollment trends
- Teacher performance metrics
- Student engagement data

---

## 🔌 API Documentation

### Server Actions (Backend)

#### Payment Actions (`app/actions/payment-actions.ts`)

**`createPaymentOrder(courseId: string)`**
- Creates Razorpay order for course enrollment
- Returns: `{ orderId, amount, currency, keyId, customerEmail, customerName, paymentId }`
- Validates: User auth, course exists, no duplicate enrollment

**`verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature)`**
- Verifies Razorpay payment signature
- Creates enrollment on success
- Returns: `{ success: true, enrollmentId, courseId }`
- Validates: HMAC-SHA256 signature, payment record, user authorization

**`getPaymentStatus(paymentId: string)`**
- Get payment status (PENDING, SUCCESS, FAILED, REFUNDED)
- Returns complete payment record

---

#### Enrollment Actions (`app/actions/admin-enrollment-actions.ts`)

**`getEnrollments(courseId?: string, universityId?: string)`**
- Get all enrollments (paginated)
- Requires: ADMIN role
- Filters: By course or university

**`removeStudentFromCourse(enrollmentId: string, courseId: string)`**
- Delete enrollment, revoke student access
- Requires: ADMIN role
- Validates: Enrollment exists, matches course
- Revalidates: `/admin/courses/enrollments` and `/admin/analytics`

**`getAdminAnalytics()`**
- Get platform-wide analytics
- Requires: ADMIN role
- Returns: `{ totalUsers, totalTeachers, totalCourses, totalEnrollments, totalRevenue }`

---

#### Notification Actions (`app/actions/notification-actions.ts`)

**`getMyNotifications()`**
- Get current user's notifications
- Returns: Sorted by recency, includes sender, course, university info

**`sendUniversityInvite(universityId, userId, subject?)`**
- Send invitation to user to join university
- Creates notification record
- Sends email invitation
- Requires: UNIVERSITY_ADMIN role

**`acceptUniversityInvite(notificationId: string)`**
- Accept university invitation
- Updates notification status
- Creates universityTeacher record
- Updates user role to TEACHER if was STUDENT

**`sendCourseAssignment(universityId, courseId, userId)`**
- Assign course to teacher
- Updates course ownership
- Creates notification

---

### API Routes

**`POST /api/s3/upload`**
- Request presigned S3 URL for video upload
- Payload: `{ filename, contentType }`
- Returns: `{ url, uploadUrl }`
- Validates: User auth, file type, bucket access

---

## 🚀 Deployment

### Deploying to Vercel

#### 1. Connect Repository
```bash
# Push code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Create Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select framework: "Next.js"

#### 3. Set Environment Variables
In Vercel Project Settings → Environment Variables, add all vars from `.env.example`:

**Critical Variables:**
- `DATABASE_URL` - Neon PostgreSQL URL
- `BETTER_AUTH_SECRET` - Auth secret
- `RAZORPAY_KEY_ID` - Production Razorpay key
- `RAZORPAY_KEY_SECRET` - Production secret
- `AWS_*` - All AWS credentials
- `RESEND_API_KEY` - Email API key
- `NEXT_PUBLIC_APP_URL` - Production URL
- `BETTER_AUTH_URL` - Production URL

#### 4. Configure Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `pnpm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)

#### 5. Deploy
1. Click "Deploy"
2. Vercel builds and deploys automatically
3. View deployment at provided URL

#### 6. Post-Deployment
```bash
# Run migrations on production
# Use Vercel CLI or Prisma Migrate
npx prisma migrate deploy --skip-generate

# Or use Prisma db push
npx prisma db push
```

#### 7. Test Production
- Test payment flow with test Razorpay credentials
- Verify all auth providers work
- Check S3 uploads work properly
- Test email notifications

---

## 🐛 Troubleshooting

### Payment Issues

**Error: "401 BAD_REQUEST_ERROR - Authentication failed"**
- **Cause**: Razorpay credentials missing/invalid in Vercel
- **Solution**:
  1. Log into [Razorpay Dashboard](https://dashboard.razorpay.com)
  2. Go to Settings → API Keys
  3. Copy TEST mode key and secret
  4. Update Vercel environment variables
  5. Redeploy

**Error: "The length must be no more than 40 characters"**
- **Cause**: Receipt field too long
- **Solution**: Already fixed in latest version (uses short dynamic IDs)

### Mobile Menu Issues

**Mobile hamburger menu scrolls within area instead of full-screen**
- **Cause**: Using `absolute` positioning instead of `fixed`
- **Solution**: Already fixed with `fixed` positioning and proper z-indexing

**Mobile menu not closing when clicking link**
- **Cause**: onClick handler not firing
- **Solution**: Verified all links have proper click handlers

### Database Issues

**Error: "Database connection failed"**
- **Cause**: Invalid DATABASE_URL or network issues
- **Solution**:
  1. Verify DATABASE_URL in `.env`
  2. Check Neon database is active
  3. Ensure IP whitelist allows your server
  4. Test with: `npx prisma db execute --stdin < /dev/null`

**Error: "The length must be no more than 40 characters"**
- **Cause**: Prisma schema validation
- **Solution**: Update schema and run `npx prisma db push`

### Authentication Issues

**Error: "Unauthorized" on protected routes**
- **Cause**: User not authenticated or session expired
- **Solution**:
  1. Clear browser cookies
  2. Re-login to refresh session
  3. Check `BETTER_AUTH_SECRET` is set

### S3 Upload Issues

**Error: "Access Denied" when uploading video**
- **Cause**: IAM permissions or bucket policy issues
- **Solution**:
  1. Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
  2. Ensure S3:PutObject permission
  3. Check bucket name is correct
  4. Verify CORS configuration on bucket

---

## 📊 Performance Optimization

### Current Optimizations
- **Prisma Query Optimization**: Uses `select` and `include` strategically
- **S3 Presigned URLs**: Direct browser-to-S3 uploads (no server bottleneck)
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic with Next.js App Router
- **Caching**: Next.js revalidatePath for on-demand revalidation

### Recommended Future Improvements
- Add Redis caching for frequently accessed data
- Implement CDN for static assets
- Add database indexing on frequently queried fields
- Implement API rate limiting with ArcJet
- Add monitoring with Vercel Analytics

---

## 🔒 Security Considerations

- ✅ HTTPS enforced in production
- ✅ Environment variables never exposed
- ✅ HMAC-SHA256 signature verification for payments
- ✅ Role-based access control on all endpoints
- ✅ Prisma prevents SQL injection
- ✅ Zod validates all inputs
- ✅ CORS configured properly
- ✅ ArcJet provides DDoS protection

---

## 📝 Roadmap & Future Features

- [ ] Real-time video call sessions (Zoom/Agora integration)
- [ ] Discussion forums for courses
- [ ] Student peer-to-peer help
- [ ] Advanced progress tracking with certificates
- [ ] Live class scheduling for instructors
- [ ] Mobile app (React Native or Flutter)
- [ ] Advanced analytics dashboard
- [ ] Automatic video subtitle generation
- [ ] A/B testing framework
- [ ] Multi-currency support

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Support & Contact

For issues, questions, or feedback:
- Open an issue on GitHub
- Email: support@bitlearn.com
- Contact form: [Contact Page](https://bit-learn.vercel.app/contact)

---

**Built with ❤️ by the BitLearn Team**
