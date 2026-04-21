"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { authClient } from '@/lib/auth-client'
import { Loader2, MailIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner'

const VerifyRequestPage = () => {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [emailPending, startEmailTransition] = useTransition();
    const email = useSearchParams().get("email");
    const isOtpCompleted = otp.length === 6;
    // verfication of email
    function VerifyOtp() {
        startEmailTransition(async () => {
            await authClient.signIn.emailOtp({
                email: email || "",
                otp: otp,
                fetchOptions: {
                    onSuccess: () => { toast.success("Email Verified Successfully"); router.push(`/`) },
                    onError: (err) => { toast.error(err?.error?.message || "Login Failed , AN Error occurred"); }
                }
            })
        })
    }
    return (
        <Card className='w-full mx-auto'>
            <CardHeader className='text-center'>
                <CardTitle className='text-xl'>Verify Your Email</CardTitle>
                <CardDescription>We have sent a verification code to your email address. Please enter the code to verify your email.</CardDescription>
            </CardHeader>
            <CardContent className='flex justify-center items-center flex-col gap-4'>
                <InputOTP value={otp} onChange={(value) => setOtp(value)} maxLength={6} className='gap-2'>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>

                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <p className='text-muted-foreground text-sm font-bold font-mono text-center tracking-tight hover:text-foreground cursor-pointer'>Enter 6-digit code sent to your email</p>
                <Button
                    disabled={emailPending || !isOtpCompleted}
                    onClick={VerifyOtp}
                    className='w-full cursor-pointer'>
                    {emailPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin cursor-not-allowed" />
                            <span>Loading ...</span>
                        </>
                    ) : (
                        <>
                            <MailIcon className="size-4" />
                            Verify Email
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}

export default VerifyRequestPage