-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('UNIVERSITY_INVITE', 'COURSE_ASSIGNMENT', 'GENERAL');

-- CreateEnum
CREATE TYPE "public"."NotificationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'READ');

-- CreateTable
CREATE TABLE "public"."notification" (
    "id" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL DEFAULT 'GENERAL',
    "status" "public"."NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "title" TEXT NOT NULL,
    "message" TEXT,
    "senderId" TEXT,
    "receiverId" TEXT NOT NULL,
    "universityId" TEXT,
    "courseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "public"."university"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
