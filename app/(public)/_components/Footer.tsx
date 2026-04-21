import Link from "next/link";
import { GraduationCap, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
              <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                BitLearn
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Empowering global learners with high-quality, accessible, and interactive courses. Master your next skill today.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground tracking-tight">Platform</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/courses" className="hover:text-primary transition-colors">Browse Courses</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Student Dashboard</Link></li>
              <li><Link href="/become-teacher" className="hover:text-primary transition-colors flex items-center gap-2">Become a Teacher <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium leading-none">NEW</span></Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground tracking-tight">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Community Guidelines</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Tutorials</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground tracking-tight">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t pt-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BitLearn. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span>Made with ❤️ for education.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
