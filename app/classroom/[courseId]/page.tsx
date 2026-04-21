import { prisma } from "@/lib/db";
import { checkEnrollment } from "@/app/actions/enrollment-actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Circle, PlayCircle, Video } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default async function ClassroomPage({ params, searchParams }: { params: Promise<{ courseId: string }>, searchParams: Promise<{ lessonId?: string }> }) {
    const p = await params;
    const sp = await searchParams;

    // Must be enrolled
    const isEnrolled = await checkEnrollment(p.courseId);
    if (!isEnrolled) {
        redirect(`/courses/${p.courseId}`);
    }

    const course = await prisma.course.findUnique({
        where: { id: p.courseId },
        include: {
            modules: {
                orderBy: { order: "asc" },
                include: {
                    lessons: {
                        orderBy: { order: "asc" }
                    }
                }
            }
        }
    });

    if (!course) notFound();

    // Determine current lesson
    let currentLesson = null;
    if (sp.lessonId) {
        for (const mod of course.modules) {
            const l = mod.lessons.find((l: any) => l.id === sp.lessonId);
            if (l) currentLesson = l;
        }
    }

    // Default to first lesson if none selected
    if (!currentLesson && course.modules[0]?.lessons[0]) {
        currentLesson = course.modules[0].lessons[0];
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Main Player Area */}
            <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
                {/* Navbar */}
                <header className="h-16 flex items-center px-6 border-b shrink-0 bg-card">
                    <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Link>
                    <h1 className="ml-4 text-sm font-semibold truncate hidden sm:block">{course.title}</h1>
                </header>

                <div className="p-6">
                    {/* Video Player Placeholder */}
                    <div className="aspect-video w-full max-w-5xl mx-auto bg-black rounded-lg overflow-hidden flex items-center justify-center border shadow-lg relative group">
                        {currentLesson?.videoKey ? (
                            <video
                                controls
                                className="w-full h-full object-contain bg-black"
                                controlsList="nodownload"
                                src={`https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${currentLesson.videoKey}`}
                                poster={course.imageUrl || undefined}
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="text-center space-y-4">
                                <PlayCircle className="w-20 h-20 text-white/50 mx-auto" />
                                <p className="text-white/70">Select a lesson to begin playing</p>
                            </div>
                        )}
                    </div>

                    {currentLesson && (
                        <div className="max-w-5xl mx-auto mt-8">
                            <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                            <p className="text-muted-foreground mt-2">Lesson description or resources can go here.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Curriculum Sidebar */}
            <aside className="w-80 border-l bg-card shrink-0 h-full flex flex-col hidden lg:flex">
                <div className="p-4 border-b shrink-0 bg-muted/30">
                    <h3 className="font-semibold text-lg">Course Content</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {course.modules.map((mod, i) => (
                        <div key={mod.id} className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                                Section {i + 1}: {mod.title}
                            </h4>
                            <div className="space-y-1">
                                {mod.lessons.map((lesson, j) => {
                                    const isActive = currentLesson?.id === lesson.id;
                                    return (
                                        <Link
                                            key={lesson.id}
                                            href={`/classroom/${course.id}?lessonId=${lesson.id}`}
                                            className={`flex items-start gap-3 p-3 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                                        >
                                            <div className="mt-0.5 shrink-0">
                                                {/* Placeholder for progress/completion status */}
                                                <Circle className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                            </div>
                                            <div className="text-sm">
                                                <p className={isActive ? "font-medium" : "text-muted-foreground"}>
                                                    {j + 1}. {lesson.title}
                                                </p>
                                                <p className="text-xs mt-1 opacity-70">
                                                    {lesson.duration > 0 ? `${Math.floor(lesson.duration / 60)}:${(lesson.duration % 60).toString().padStart(2, '0')}` : 'Video'}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}
