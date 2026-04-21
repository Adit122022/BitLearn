"use client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { Indie_Flower } from 'next/font/google'
import { ArrowLeft, Cat } from 'lucide-react'

// Load Indie Flower font from Google Fonts
const indie = Indie_Flower({
  weight: "400",
  subsets: ["latin"],
})

export default function NotFound() {
  const { data: session } = authClient.useSession()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] bg-background overflow-hidden relative px-4 py-10">
      {/* Background blurs */}
      <div className="absolute top-[10%] left-1/4 -z-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-red-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-1/4 -z-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center w-full relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-6 sm:space-y-8">

        {/* Animated Cats Graphics */}
        <div className="relative flex items-end justify-center mb-4 sm:mb-8 mt-8">
          {/* Left Cat */}
          <div className="animate-bounce mr-4" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }}>
            <Cat className="w-16 h-16 sm:w-24 sm:h-24 text-muted-foreground opacity-70" />
          </div>
          {/* Main Middle Cat */}
          <div className="animate-bounce z-10" style={{ animationDuration: '3s' }}>
            <Cat className="w-24 h-24 sm:w-36 sm:h-36 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
          </div>
          {/* Right Cat */}
          <div className="animate-bounce ml-4" style={{ animationDuration: '2s', animationDelay: '0.5s' }}>
            <Cat className="w-12 h-12 sm:w-20 sm:h-20 text-muted-foreground opacity-60" />
          </div>

          {/* Particles/Stars floating around */}
          <div className="absolute top-0 -left-6 sm:-left-10 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute bottom-10 -right-6 sm:-right-12 w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />
        </div>

        <h1 className="text-4xl sm:text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-200 drop-shadow-sm leading-none">
          404
        </h1>

        {/* Funny line using Indie Flower typography */}
        <div className="px-2">
          <h2 className={`${indie.className} font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-4xl text-foreground !leading-tight mt-1 sm:mt-2 tracking-wide`}>
            Whoops! The cats knocked this page off the table...
          </h2>
        </div>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1 max-w-xl mx-auto px-4">
          We can&apos;t seem to find the page you&apos;re looking for. It might have been deleted, moved, or claimed by the feline overlords.
        </p>

        <div className=" w-full flex justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto text-base sm:text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all group bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 whitespace-nowrap"
          >
            <Link href={session ? "/dashboard" : "/"}>
              <ArrowLeft className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:-translate-x-1.5 transition-transform" />
              {session ? "Take Me Back to Dashboard" : "Take Me Home"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
