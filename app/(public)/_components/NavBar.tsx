"use client";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/themeToggel";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brand } from "@/lib/env";
import Image from "next/image";
import { Sparkles, Menu, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useSignout } from "@/hooks/use-signout";


const baseNavItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { handleSignout } = useSignout();

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const router = useRouter();
  const { data: session } = authClient.useSession();
  const userRole = (session?.user as any)?.role;

  const navigationItems = userRole === "UNIVERSITY_ADMIN"
    ? [...baseNavItems, { name: "University Dashboard", href: "/university/dashboard" }]
    : [...baseNavItems, { name: "For Universities", href: "/request-university" }];
  const username = session?.user?.name && session?.user?.name.length > 0 ? session?.user?.name.charAt(0).toUpperCase() : session?.user?.email.slice(0, 2).toUpperCase();
  const avatarURL = session?.user?.image ?? `https://avatar.vercel.sh/${session?.user?.email.split("@")[0]}.svg?text=${username?.toLowerCase()}&size=100`;

  return <header className="w-full sticky top-0 z-10 justify-between items-center flex py-4 px-4 md:py-5 md:px-10 backdrop-blur-md overflow-x-hidden outline-1 bg-background/50">
    <Link className="text-xl md:text-2xl font-mono flex items-center gap-2 max-w-[45vw] sm:max-w-none" href='/'>
      <Image className="rounded-full w-8 h-8 md:w-[50px] md:h-[50px] shrink-0" src="/Logo.png" alt="Logo" width={50} height={50} />
      <span className="truncate">{Brand}</span>
    </Link>
    {/* Desktop Navigation */}
    <nav className="hidden md:block">
      <ul className="flex items-center gap-4">
        {navigationItems.map((item) => (
          <li key={item.href}>
            <Link className={buttonVariants({ variant: "link" })} href={item.href}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
    <div className="flex items-center gap-2 md:gap-4">
      <ThemeToggle />
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>

            <Avatar className="hover:cursor-pointer">
              <AvatarImage src={avatarURL} />
              <AvatarFallback>{username}</AvatarFallback>
            </Avatar>

          </DropdownMenuTrigger>
          <DropdownMenuContent className="relative z-99" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <div className="relative shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Avatar className={`h-12 w-12 cursor-pointer border border-border`} onClick={(e) => e.stopPropagation()} >
                          <AvatarImage src={avatarURL} />
                          <AvatarFallback>{username}</AvatarFallback>
                        </Avatar>
                      </DialogTrigger>
                      <DialogContent className="bg-transparent border-none p-0 flex flex-col-reverse items-center justify-center shadow-none">
                        <DialogHeader className="flex flex-col items-center">
                          <DialogTitle>{session?.user?.name}</DialogTitle>
                          <DialogDescription className="hidden">
                            {session?.user?.name}'s profile
                          </DialogDescription>
                        </DialogHeader>
                        <img
                          src={avatarURL}
                          alt={`${session?.user?.name}'s Avatar`}
                          className={`w-72 h-72 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl`}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{session?.user?.name}</span>
                    <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/courses">Courses
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/classroom">Classroom
                  <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/inbox">Inbox
                  <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard
                  <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              {((session?.user as any)?.role === "ADMIN" || (session?.user as any)?.role === "TEACHER") && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Teacher Studio
                    <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              )}
              {(session?.user as any)?.role === "UNIVERSITY_ADMIN" && (
                <DropdownMenuItem asChild>
                  <Link href="/university/dashboard">University Portal
                    <DropdownMenuShortcut>⌘U</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignout} className="text-rose-500 cursor-pointer">
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>


      ) : (
        <Link className={buttonVariants({ variant: 'outline', className: 'px-3 sm:px-4' })} href='/login'>
          <Sparkles className="animate-pulse animate-duration-1000 animate-ease-in-out mr-0 sm:mr-2" /> <span className="hidden sm:inline">Get Started</span></Link>
      )}

      {/* Mobile Menu Hamburger */}
      <button
        className="md:hidden p-1 sm:p-2 text-foreground flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>

    {/* Mobile Navigation Full Screen Overlay */}
    {isMobileMenuOpen && (
      <div
        className="md:hidden fixed inset-0 top-16 z-40 bg-background"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <nav className="flex flex-col items-center justify-start pt-8 gap-8 px-4">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-2xl font-semibold tracking-wider hover:text-primary transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    )}

  </header>
}