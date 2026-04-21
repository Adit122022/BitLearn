import { ReactNode } from "react";
import Navbar from "@/app/(public)/_components/NavBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    // We reuse the public Navbar which has the user menu logic 
    // In a full production app, you might build a dedicated sidebar for students
    return (
        <div className="min-h-screen bg-muted/20">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
