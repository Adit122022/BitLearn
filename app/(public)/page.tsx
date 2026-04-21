"use client"
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  ArrowRight, Sparkles, GraduationCap, BookOpen, Users, Trophy,
  Star, Play, CheckCircle, Zap, Globe, Shield, TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureInterface {
  title: string;
  description: string;
  icon: string;
}

const features: FeatureInterface[] = [
  { title: "Comprehensive Courses", description: "Access a wide range of carefully curated courses designed by industry experts.", icon: "📚" },
  { title: "Interactive Learning", description: "Engage with hands-on projects, quizzes, and real-time feedback to master new skills effectively.", icon: "🎓" },
  { title: "Flexible Schedule", description: "Learn at your own pace, anytime and anywhere, with our mobile-friendly platform.", icon: "⏰" },
  { title: "Expert Mentorship", description: "Connect with experienced instructors and a vibrant community to get guidance and support.", icon: "👨‍🏫" },
  { title: "Progress Tracking", description: "Monitor your learning progress with detailed analytics and insights.", icon: "📊" },
  { title: "24/7 Support", description: "Get help whenever you need it with our dedicated round-the-clock support team.", icon: "📞" },
];

const stats = [
  { label: "Active Learners", value: "50K+", icon: Users },
  { label: "Expert Courses", value: "500+", icon: BookOpen },
  { label: "Completion Rate", value: "94%", icon: Trophy },
  { label: "Countries Reached", value: "80+", icon: Globe },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Full-Stack Developer",
    avatar: "SJ",
    rating: 5,
    text: "BitLearn transformed my career. The interactive courses and expert mentorship helped me land my dream job in just 6 months!",
    color: "from-violet-500/20 to-purple-500/10",
  },
  {
    name: "Marcus Chen",
    role: "Data Scientist",
    avatar: "MC",
    rating: 5,
    text: "The structured learning paths and real-world projects are incredible. I went from beginner to professional data scientist thanks to BitLearn.",
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    name: "Aisha Patel",
    role: "UX Designer",
    avatar: "AP",
    rating: 5,
    text: "What sets BitLearn apart is the community. The mentors are always available and the feedback is genuinely helpful and actionable.",
    color: "from-emerald-500/20 to-teal-500/10",
  },
];

const whyUs = [
  { icon: Zap, title: "Fast-Track Learning", desc: "Structured paths designed to get you job-ready in weeks, not years." },
  { icon: Shield, title: "Verified Certificates", desc: "Earn industry-recognized certificates that employers actually trust." },
  { icon: TrendingUp, title: "Career Growth", desc: "85% of our graduates report a salary increase within their first year." },
];

export default function Home() {
  const { data: session } = authClient.useSession();

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden">

      {/* ── BACKGROUND GLOWS ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(900px,100vw)] h-[600px] bg-primary/15 blur-[140px] rounded-full" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -left-40 w-[400px] h-[400px] bg-violet-500/10 blur-[120px] rounded-full" />
      </div>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="relative w-full px-4 sm:px-6 pt-20 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center z-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6 sm:gap-8">

          {/* Pill badge */}
          <Badge
            variant="outline"
            className="px-4 py-1.5 text-xs sm:text-sm rounded-full bg-background/50 backdrop-blur-md border-primary/30 hover:border-primary/60 transition-all duration-300 gap-2 shadow-sm"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-pulse" />
            <span className="font-medium">The Future of Online Education</span>
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Master New Skills with
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-violet-500">
              {" "}BitLearn
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed px-2">
            Experience world-class learning with a seamless, interactive, and comprehensive
            platform designed to help you achieve your goals faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="rounded-full w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group">
              <Link href="/courses">
                Explore Courses
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base bg-background/50 backdrop-blur-sm border-border hover:bg-muted transition-all group">
              <Link href={session ? "/dashboard" : "/login"}>
                <GraduationCap className="mr-2 w-4 h-4 group-hover:scale-125 group-hover:rotate-12 transition-transform" />
                {session ? "Go to Dashboard" : "Start for Free"}
              </Link>
            </Button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground pt-2">
            {["No credit card required", "Free forever plan", "Cancel anytime"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── HERO MOCKUP ── */}
        <div className="mt-12 sm:mt-16 w-full max-w-5xl px-2 sm:px-0">
          <div className="relative rounded-2xl border border-border/60 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden">

            {/* Glow top line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent z-30" />
            {/* Fade-out at the bottom */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />

            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/20">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 ml-4 h-5 max-w-[200px] bg-muted-foreground/10 rounded-full flex items-center px-3">
                <div className="h-2 w-24 bg-muted-foreground/15 rounded-full" />
              </div>
            </div>

            {/* Mockup body */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 min-h-[320px] md:min-h-[380px]">

              {/* Sidebar */}
              <div className="hidden md:flex flex-col gap-4 p-5 border-r border-border/40 bg-muted/10">
                <div className="h-7 w-20 bg-primary/20 rounded-lg" />
                <div className="space-y-2 mt-2">
                  {[100, 85, 70, 90, 65].map((w, i) => (
                    <div key={i} className={`h-3 rounded-full bg-muted-foreground/${i === 1 ? "20" : "10"}`} style={{ width: `${w}%` }} />
                  ))}
                </div>
                <div className="mt-auto space-y-2">
                  {[60, 75].map((w, i) => (
                    <div key={i} className="h-3 rounded-full bg-muted-foreground/10" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>

              {/* Main content */}
              <div className="md:col-span-3 p-4 sm:p-6 flex flex-col gap-5">

                {/* Top stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Courses Done", val: "12", color: "text-violet-400" },
                    { label: "Hours Learned", val: "148", color: "text-blue-400" },
                    { label: "Certificates", val: "4", color: "text-emerald-400" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-muted/30 border border-border/30 p-3">
                      <div className={`text-base sm:text-lg font-bold ${s.color}`}>{s.val}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Course progress card */}
                <div className="rounded-xl bg-gradient-to-tr from-indigo-500/10 to-primary/10 border border-primary/20 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-3 w-36 bg-primary/30 rounded-full mb-2" />
                      <div className="h-2 w-24 bg-foreground/10 rounded-full" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Play className="w-3 h-3 text-primary fill-primary" />
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-muted-foreground/10 rounded-full overflow-hidden">
                    <div className="h-full w-[68%] bg-gradient-to-r from-primary to-indigo-500 rounded-full" />
                  </div>
                  <div className="text-xs text-muted-foreground/60">68% complete</div>
                </div>

                {/* Recent activity */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Next Lesson", sub: "Advanced TypeScript", col: "bg-violet-500/10 border-violet-500/20" },
                    { label: "Assignment Due", sub: "in 2 days", col: "bg-amber-500/10 border-amber-500/20" },
                  ].map((c) => (
                    <div key={c.label} className={`rounded-lg border ${c.col} p-3`}>
                      <div className="h-2 w-16 bg-foreground/10 rounded-full mb-2" />
                      <div className="h-2 w-full bg-foreground/8 rounded-full" />
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Floating badge — hidden on very small screens */}
            <div className="hidden sm:flex absolute -top-4 -right-4 md:right-8 md:top-8 items-center gap-2 bg-background/80 backdrop-blur-md border border-border/60 rounded-2xl px-4 py-2.5 shadow-xl z-30 animate-bounce-slow">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <div className="text-xs font-semibold">Certificate Earned!</div>
                <div className="text-[10px] text-muted-foreground">React Mastery</div>
              </div>
            </div>

            {/* Floating rating badge */}
            <div className="hidden sm:flex absolute bottom-8 -left-4 md:left-8 items-center gap-2 bg-background/80 backdrop-blur-md border border-border/60 rounded-2xl px-4 py-2.5 shadow-xl z-30">
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              </div>
              <div className="text-xs font-semibold">4.9/5 <span className="text-muted-foreground font-normal">rating</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS SECTION
      ══════════════════════════════════════════ */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-5 sm:p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">{stat.value}</span>
                <span className="text-xs sm:text-sm text-muted-foreground text-center">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY BITLEARN
      ══════════════════════════════════════════ */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20 z-10">
        <div className="text-center mb-10 md:mb-14">
          <Badge variant="outline" className="mb-4 px-3 py-1 rounded-full text-xs border-primary/30">Why BitLearn?</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Built for your success</h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Everything you need to grow your skills and advance your career in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {whyUs.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="relative flex flex-col items-start gap-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-6 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 z-10">
        <div className="text-center mb-10 md:mb-14">
          <Badge variant="outline" className="mb-4 px-3 py-1 rounded-full text-xs border-primary/30">Features</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Everything you need to excel</h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            A rich set of tools and resources designed to make your learning journey smooth and effective.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/40 backdrop-blur-md border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl sm:text-3xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-primary/10">
                  {feature.icon}
                </div>
                <CardTitle className="text-base sm:text-xl font-semibold tracking-tight">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 z-10">
        <div className="text-center mb-10 md:mb-14">
          <Badge variant="outline" className="mb-4 px-3 py-1 rounded-full text-xs border-primary/30">Testimonials</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Loved by learners worldwide</h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Thousands of students have transformed their careers with BitLearn.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col gap-4 rounded-2xl bg-gradient-to-br ${t.color} border border-border/50 backdrop-blur-md p-6 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300`}
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-foreground/90 flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-border/30">
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════ */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20 pb-24 z-10">
        <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-indigo-500/5 to-violet-500/10 backdrop-blur-md p-8 sm:p-12 md:p-16 text-center overflow-hidden">
          {/* Decorative blur blobs */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-5 sm:gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-2xl">
              Ready to start your learning journey?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-lg">
              Join 50,000+ learners already growing with BitLearn. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Button asChild size="lg" className="rounded-full w-full sm:w-auto h-12 sm:h-14 px-8 text-sm sm:text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group">
                <Link href={session ? "/dashboard" : "/login"}>
                  {session ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full w-full sm:w-auto h-12 sm:h-14 px-8 text-sm sm:text-base bg-background/50 backdrop-blur-sm hover:bg-muted transition-all">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
