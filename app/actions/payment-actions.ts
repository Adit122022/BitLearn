"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { env } from "@/lib/env"
import Razorpay from "razorpay"
import crypto from "crypto"

let razorpay: Razorpay | null = null

function getRazorpay() {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    })
  }
  return razorpay
}

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")
  return session
}

export async function createPaymentOrder(courseId: string) {
  const session = await getSession()

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, title: true, price: true },
  })

  if (!course) throw new Error("Course not found")
  if (course.price === 0) throw new Error("Cannot create payment for free course")

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: courseId,
      },
    },
  })

  if (existingEnrollment) throw new Error("You are already enrolled in this course")

  const razorpayOrder = await getRazorpay().orders.create({
    amount: course.price * 100,
    currency: "INR",
    receipt: `bitlearn_${courseId}_${session.user.id}`,
    notes: {
      courseId,
      userId: session.user.id,
      courseTitle: course.title,
    },
  })

  const payment = await prisma.payment.create({
    data: {
      razorpayOrderId: razorpayOrder.id,
      userId: session.user.id,
      courseId,
      amount: course.price,
      status: "PENDING",
    },
  })

  return {
    orderId: razorpayOrder.id,
    amount: course.price,
    currency: "INR",
    keyId: env.RAZORPAY_KEY_ID,
    customerEmail: session.user.email,
    customerName: session.user.name || "Student",
    paymentId: payment.id,
  }
}

export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  const session = await getSession()

  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex")

  if (expectedSignature !== razorpaySignature) {
    throw new Error("Payment verification failed")
  }

  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId },
  })

  if (!payment) throw new Error("Payment record not found")
  if (payment.userId !== session.user.id) throw new Error("Unauthorized")

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: payment.courseId,
      },
    },
  })

  if (enrollment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
      },
    })
    throw new Error("You are already enrolled in this course")
  }

  const newEnrollment = await prisma.enrollment.create({
    data: {
      userId: session.user.id,
      courseId: payment.courseId,
      amount: payment.amount,
      paidAt: new Date(),
    },
  })

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "SUCCESS",
      razorpayPaymentId,
      enrollmentId: newEnrollment.id,
    },
  })

  return {
    success: true,
    enrollmentId: newEnrollment.id,
    courseId: payment.courseId,
  }
}

export async function getPaymentStatus(paymentId: string) {
  const session = await getSession()

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  })

  if (!payment || payment.userId !== session.user.id) {
    throw new Error("Payment not found")
  }

  return payment
}
