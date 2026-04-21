"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { applyToBeTeacher, checkApplicationStatus } from "@/app/actions/teacher-actions";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/app/(public)/_components/NavBar";

export default function BecomeTeacherPage() {
    const [bio, setBio] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        checkApplicationStatus()
            .then(res => setStatus(res))
            .finally(() => setIsLoading(false));
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (bio.length < 10) {
            toast.error("Please provide a more detailed bio (min 10 characters)");
            return;
        }

        setIsSubmitting(true);
        try {
            await applyToBeTeacher({ bio });
            setStatus("Pending");
            toast.success("Application submitted successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to submit application");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-muted/20">

            <main className="max-w-6xl mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Become an Instructor</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Share your knowledge, inspire students globally, and earn by creating premium technical courses on BitLearn.</p>
                </div>

                {/* Advantages Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">🌍</span>
                            </div>
                            <CardTitle>Global Reach</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Reach and inspire millions of students from all around the world. Build a community of passionate learners.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">💰</span>
                            </div>
                            <CardTitle>Passive Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Earn money every time a student enrolls in your course. Turn your expertise into an enduring revenue stream.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">🚀</span>
                            </div>
                            <CardTitle>Build Your Brand</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Establish yourself as an industry expert. We provide the platform, marketing, and tools so you can focus on teaching.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Application Form */}
                <div className="max-w-3xl mx-auto">
                    <Card className="border-2 shadow-xl">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-2xl">Instructor Application</CardTitle>
                            <CardDescription>Tell us about your expertise and teaching experience</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {isLoading ? (
                                <div className="text-center py-8">Loading your status...</div>
                            ) : status === "Pending" ? (
                                <div className="text-center py-12 px-6 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                    <h3 className="text-xl font-semibold text-amber-600 mb-2">Application Under Review</h3>
                                    <p className="text-muted-foreground">Our moderation team is reviewing your application. You will be notified once a decision has been made.</p>
                                </div>
                            ) : status === "Approved" ? (
                                <div className="text-center py-12 px-6 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <h3 className="text-xl font-semibold text-green-600 mb-2">You are an Instructor!</h3>
                                    <p className="text-muted-foreground mb-6">Your application was approved. You can now access the teacher dashboard.</p>
                                    <Button asChild>
                                        <a href="/admin">Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" /></a>
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Why do you want to teach on BitLearn?</label>
                                        <Textarea
                                            placeholder="I have 5 years of experience in React and want to help beginners..."
                                            className="min-h-[150px] resize-none"
                                            value={bio}
                                            onChange={e => setBio(e.target.value)}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">This will be used to create your public teacher profile. Must be at least 10 characters.</p>
                                    </div>
                                    <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Submit Application"}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
