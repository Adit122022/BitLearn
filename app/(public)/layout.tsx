import Navbar from "./_components/NavBar";
import Footer from "./_components/Footer";

export default function LayoutPublic({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-x-hidden container mx-auto px-4 md:px-6 lg:8">
                {children}
            </main>
            <Footer />
        </div>
    )
}