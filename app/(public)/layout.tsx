import Navbar from "./_components/NavBar";


export default function LayoutPublic({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className=" overflow-x-hidden container mx-auto px-4 md:px-6 lg:8"> {children}</main>
        </>
    )
}