-- AlterTable
ALTER TABLE "public"."course" ADD COLUMN     "universityId" TEXT;

-- CreateTable
CREATE TABLE "public"."university" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "website" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."university_admin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "university_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."university_teacher" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "subject" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "university_teacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "university_slug_key" ON "public"."university"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "university_email_key" ON "public"."university"("email");

-- CreateIndex
CREATE UNIQUE INDEX "university_admin_userId_universityId_key" ON "public"."university_admin"("userId", "universityId");

-- CreateIndex
CREATE UNIQUE INDEX "university_teacher_userId_universityId_key" ON "public"."university_teacher"("userId", "universityId");

-- AddForeignKey
ALTER TABLE "public"."course" ADD CONSTRAINT "course_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "public"."university"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."university_admin" ADD CONSTRAINT "university_admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."university_admin" ADD CONSTRAINT "university_admin_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "public"."university"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."university_teacher" ADD CONSTRAINT "university_teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."university_teacher" ADD CONSTRAINT "university_teacher_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "public"."university"("id") ON DELETE CASCADE ON UPDATE CASCADE;
