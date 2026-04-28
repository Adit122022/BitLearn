"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
}

export default function PaymentForm({
  courseId,
  courseTitle,
  price,
}: PaymentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    if (document.getElementById("razorpay-script")) {
      setRazorpayLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.id = "razorpay-script"
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    script.onerror = () => {
      toast.error("Failed to load payment gateway. Please try again.")
    }
    document.body.appendChild(script)
  }, [])

  const handlePayment = async () => {
    try {
      if (!razorpayLoaded || !window.Razorpay) {
        toast.error("Payment gateway is loading. Please try again.")
        return
      }

      setIsLoading(true)

      const orderData = await createPaymentOrder(courseId)

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
            await verifyPayment(
              orderData.orderId,
              response.razorpay_payment_id,
              response.razorpay_signature
            )
            toast.success("Payment successful! You are now enrolled.")
            router.push(`/classroom/${courseId}`)
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
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate payment")
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading || !razorpayLoaded}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : !razorpayLoaded ? (
        "Loading payment..."
      ) : (
        `Enroll for ₹${price}`
      )}
    </Button>
  )
}
