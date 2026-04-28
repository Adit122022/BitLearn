"use client"

import { useState } from "react"
import { createPaymentOrder, verifyPayment } from "@/app/actions/payment-actions"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface PaymentFormProps {
  courseId: string
  courseTitle: string
  price: number
  onSuccess: (enrollmentId: string) => void
}

export default function PaymentForm({
  courseId,
  courseTitle,
  price,
  onSuccess,
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    try {
      setIsLoading(true)

      // Create order on server
      const orderData = await createPaymentOrder(courseId)

      // Load Razorpay script
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      document.body.appendChild(script)

      script.onload = () => {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount * 100,
          currency: orderData.currency,
          name: "BitLearn",
          description: courseTitle,
          order_id: orderData.orderId,
          prefill: {
            name: orderData.customerName,
            email: orderData.customerEmail,
          },
          handler: async function (response: any) {
            try {
              const result = await verifyPayment(
                orderData.orderId,
                response.razorpay_payment_id,
                response.razorpay_signature
              )
              toast.success("Payment successful! You are now enrolled.")
              onSuccess(result.enrollmentId)
            } catch (error: any) {
              toast.error(error.message || "Payment verification failed")
              setIsLoading(false)
            }
          },
          modal: {
            ondismiss: function () {
              setIsLoading(false)
            },
          },
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate payment")
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Enroll for ₹${price}`
      )}
    </Button>
  )
}
