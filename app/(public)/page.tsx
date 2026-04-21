"use client"
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureInterface {
  title: string;
  description: string;
  icon: string;
}
const features: FeatureInterface[] = [
  {
    title: "Comprehensive Courses",
    description: "Access a wide range of carefully curated courses designed by industry experts.",
    icon: "📚"
  },
  {
    title: "Interactive Learning",
    description: "Engage with hands-on projects, quizzes, and real-time feedback to master new skills effectively.",
    icon: "🎓"
  },
  {
    title: "Flexible Schedule",
    description: "Learn at your own pace, anytime and anywhere, with our mobile-friendly platform.",
    icon: "⏰"
  },
  {
    title: "Expert Mentorship",
    description: "Connect with experienced instructors and a vibrant community to get guidance and support on your learning journey.",
    icon: "👨‍🏫"
  },
  {
    title: "Progress Tracking",
    description: "Monitor your learning progress with detailed analytics and insights.",
    icon: "📊"
  },
  { title: "Contact Support", description: "Get help whenever you need it with our 24/7 support team.", icon: "📞" }
]

export default function Home() {
  const { data: session } = authClient.useSession()

  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-screen flex flex-col items-center justify-center overflow-hidden px-10 ">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative home-section px-6 py-20 md:py-32 w-full z-10 flex flex-col items-center">
        <div className="max-w-5xl mx-auto space-y-8 flex flex-col items-center text-center">

          <Badge
            variant="outline"
            className="px-4 py-1.5 text-sm rounded-full bg-background/50 backdrop-blur-md border border-primary/30 hover:border-primary/60 transition-all duration-300 gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium">The Future of Online Education</span>
          </Badge>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Master New Skills with Our <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-primary">
              BitLearn
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground w-full max-w-2xl mx-auto leading-relaxed">
            Experience world-class learning with a seamless, interactive, and comprehensive tool designed to help you achieve your goals faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full">
            <Button asChild size="lg" className="rounded-full w-full sm:w-auto h-14 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group">
              <Link href="/courses">
                Explore More
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform ease-in-out" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="rounded-full w-full sm:w-auto h-14 px-8 text-base bg-background/50 backdrop-blur-sm border-border hover:bg-muted transition-all group">

              <Link href={session ? "/dashboard" : "/login"}>
                <GraduationCap className="mr-2 w-5 h-5 group-hover:scale-125 group-hover:rotate-12 transition-transform ease-in-out" />
                {session ? "Go to Dashboard" : "Start learning for free"}
              </Link>

            </Button>
          </div>
        </div>
      </section>

      {/* Decorative Dashboard Mockup at the bottom */}
      <div className="mt-8 w-full max-w-5xl h-[250px] md:h-[350px] relative rounded-t-2xl border-t border-x bg-card/30 backdrop-blur-3xl shadow-2xl overflow-hidden mx-6">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
        
        {/* Mockup UI Window */}
        <div className="w-full h-full p-4 md:p-8 opacity-80 pointer-events-none scale-100 origin-top">
          {/* Mock Header */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <div className="ml-4 h-4 w-64 bg-muted-foreground/10 rounded-full" />
          </div>
          
          {/* Mock Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar Mock */}
            <div className="hidden md:block col-span-1 space-y-4">
              <div className="h-8 w-24 bg-primary/20 rounded-lg mb-8" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-muted-foreground/10 rounded-full" />
                <div className="h-4 w-5/6 bg-muted-foreground/10 rounded-full" />
                <div className="h-4 w-4/6 bg-muted-foreground/10 rounded-full" />
                <div className="h-4 w-full bg-muted-foreground/10 rounded-full" />
              </div>
            </div>

            {/* Content Mock */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="aspect-video w-full rounded-xl bg-gradient-to-tr from-indigo-500/10 to-primary/10 border border-primary/20 flex flex-col justify-end p-4">
                 <div className="h-3 w-1/4 bg-primary/30 rounded-full mb-2" />
                 <div className="h-2 w-1/2 bg-foreground/10 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 rounded-lg border bg-muted/30 p-3">
                  <div className="h-3 w-1/2 bg-foreground/10 rounded-full mb-4" />
                  <div className="h-2 w-3/4 bg-foreground/10 rounded-full" />
                </div>
                <div className="h-24 rounded-lg border bg-muted/30 p-3">
                  <div className="h-3 w-1/2 bg-foreground/10 rounded-full mb-4" />
                  <div className="h-2 w-3/4 bg-foreground/10 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-10" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-30" />
      </div>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/40 backdrop-blur-md border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ease-out shadow-sm border border-primary/10">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold tracking-tight">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
