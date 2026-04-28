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
    // Load Razorpay script once on component mount
    if (document.getElementById("razorpay-script")) {
      setRazorpayLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.id = "razorpay-script"
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => {
      console.log("Razorpay script loaded successfully")
      setRazorpayLoaded(true)
    }
    script.onerror = () => {
      console.error("Failed to load Razorpay script")
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
      console.log("Creating payment order for course:", courseId)

      // Create order on server
      const orderData = await createPaymentOrder(courseId)
      console.log("Order created:", orderData)

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
            console.log("Payment response:", response)
            const result = await verifyPayment(
              orderData.orderId,
              response.razorpay_payment_id,
              response.razorpay_signature
            )
            console.log("Payment verified:", result)
            toast.success("Payment successful! You are now enrolled.")
            // Navigate to classroom after successful payment
            router.push(`/classroom/${courseId}`)
          } catch (error: any) {
            console.error("Verification error:", error)
            toast.error(error.message || "Payment verification failed")
            setIsLoading(false)
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed")
            setIsLoading(false)
          },
        },
      }

      console.log("Opening Razorpay with options:", options)
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error("Payment error:", error)
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
