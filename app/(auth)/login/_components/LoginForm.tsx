"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, GlassesIcon, Loader2, MailIcon } from "lucide-react";
import React from 'react'
import { useTransition } from "react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const [githubPending, startGithubTransition] = useTransition()
    const [googlePending, startGoogleTransition] = useTransition()
    const [emailPending, startEmailTransition] = useTransition()
    const [email, setEmail] = useState("")
    const isEmailValid = email.includes("@") && email.includes(".") && email.length > 0
    const router = useRouter();

    console.log("Login Page ->", githubPending)
    async function SignWIthGIthub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: '/',
                fetchOptions: {
                    onSuccess: () => { toast.success("Signed with Github , you will be redirected....") },
                    onError: (err) => { toast.error(err?.error?.message || "Login Failed , AN Error occurred") }
                }
            })
        })
    }
    async function SignWIthGoogle() {
        startGoogleTransition(async () => {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: '/',
                fetchOptions: {
                    onSuccess: () => { toast.success("Signed with Google , you will be redirected....") },
                    onError: (err) => { toast.error(err?.error?.message || "Login Failed , AN Error occurred") }
                }
            })
        })
    }
    //  for sending Otp to email for login
    function SignWIthEmail() {
        startEmailTransition(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: "sign-in",
                fetchOptions: {
                    onSuccess: () => { toast.success("Email Sent Successfully"); router.push(`/verify-request?email=${email}`) },
                    onError: (err) => { toast.error(err?.error?.message || "Login Failed , AN Error occurred"); }
                }

            })

        })
    }
    console.log("Login Page ->", githubPending)
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl"> Welcome Back !</CardTitle>
                <CardDescription>Login With Github Email Account</CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    disabled={githubPending}
                    onClick={SignWIthGIthub} className="w-full mb-4" variant="outline">
                    {githubPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Loading ...</span></>
                    ) : (
                        <>
                            <GithubIcon className="size-4" />
                            Sign in Using Github
                        </>
                    )}
                </Button>
                <Button
                    disabled={googlePending}
                    onClick={SignWIthGoogle} className="w-full" variant="outline">
                    {googlePending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Loading ...</span></>
                    ) : (
                        <>
                            <GlassesIcon className="size-4" />
                            Sign in Using Google
                        </>
                    )}
                </Button>
                {/*  */}
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative bg-card z-10 px-2 text-muted-foreground">Or continue with</span>
                </div>
                {/*  */}
                <div className="grid gap-3">
                    {/* INPUT FOR EMAIL */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email </Label>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="example@gmail.com" />
                    </div>
                    {/* BUTTON FOR SUBMIT */}
                    <Button onClick={SignWIthEmail} disabled={emailPending || !isEmailValid} className={`${emailPending || !isEmailValid ? "cursor-not-allowed" : "cursor-pointer"}`}>{emailPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin cursor-not-allowed" />
                            <span>Loading ...</span></>
                    ) : (
                        <>
                            <MailIcon className="size-4" />
                            Sign in Using Email
                        </>
                    )}</Button>
                </div>
            </CardContent>
        </Card>
    )
}

