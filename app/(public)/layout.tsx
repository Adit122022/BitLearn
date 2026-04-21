import Navbar from "./_components/NavBar";
import Footer from "./_components/Footer";

export default function LayoutPublic({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-x-hidden w-full">
                {children}
            </main>
            <Footer />
        </div>
    )
}