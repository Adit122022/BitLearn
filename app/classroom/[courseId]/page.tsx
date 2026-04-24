import { prisma } from "@/lib/db";
import { checkEnrollment } from "@/app/actions/enrollment-actions";
import { getCourseProgress } from "@/app/actions/lesson-progress-actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Circle, PlayCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MarkCompleteButton } from "./_components/MarkCompleteButton";

export default async function ClassroomPage({ params, searchParams }: { params: Promise<{ courseId: string }>, searchParams: Promise<{ lessonId?: string }> }) {
    const p = await params;
    const sp = await searchParams;

    const isEnrolled = await checkEnrollment(p.courseId);
    if (!isEnrolled) {
        redirect(`/courses/${p.courseId}`);
    }

    const [course, progress] = await Promise.all([
        prisma.course.findUnique({
            where: { id: p.courseId },
            include: {
                modules: {
                    orderBy: { order: "asc" },
                    include: { lessons: { orderBy: { order: "asc" } } }
                }
            }
        }),
        getCourseProgress(p.courseId),
    ]);

    if (!course) notFound();

    let currentLesson = null;
    if (sp.lessonId) {
        for (const mod of course.modules) {
            const l = mod.lessons.find((l) => l.id === sp.lessonId);
            if (l) currentLesson = l;
        }
    }
    if (!currentLesson && course.modules[0]?.lessons[0]) {
        currentLesson = course.modules[0].lessons[0];
    }

    const isCurrentCompleted = currentLesson
        ? progress.completedIds.includes(currentLesson.id)
        : false;

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Main Player Area */}
            <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
                <header className="h-16 flex items-center px-6 border-b shrink-0 bg-card gap-4">
                    <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Link>
                    <h1 className="text-sm font-semibold truncate hidden sm:block flex-1">{course.title}</h1>
                    {/* Progress pill */}
                    <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                        <Progress value={progress.percent} className="w-24 h-1.5" />
                        <span>{progress.percent}%</span>
                    </div>
                </header>

                <div className="p-6">
                    <div className="aspect-video w-full max-w-5xl mx-auto bg-black rounded-lg overflow-hidden flex items-center justify-center border shadow-lg">
                        {currentLesson?.videoKey ? (
                            <video
                                key={currentLesson.id}
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
                                <p className="text-white/70">Select a lesson to begin</p>
                            </div>
                        )}
                    </div>

                    {currentLesson && (
                        <div className="max-w-5xl mx-auto mt-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    {progress.completed} of {progress.total} lessons completed
                                </p>
                            </div>
                            <MarkCompleteButton
                                lessonId={currentLesson.id}
                                initialCompleted={isCurrentCompleted}
                            />
                        </div>
                    )}
                </div>
            </main>

            {/* Curriculum Sidebar */}
            <aside className="w-80 border-l bg-card shrink-0 h-full flex-col hidden lg:flex">
                <div className="p-4 border-b shrink-0 bg-muted/30 space-y-2">
                    <h3 className="font-semibold text-sm">Course Content</h3>
                    <div className="flex items-center gap-2">
                        <Progress value={progress.percent} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground shrink-0">{progress.percent}%</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {course.modules.map((mod, i) => (
                        <div key={mod.id} className="space-y-1">
                            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider px-2 py-1">
                                Section {i + 1}: {mod.title}
                            </h4>
                            {mod.lessons.map((lesson, j) => {
                                const isActive = currentLesson?.id === lesson.id;
                                const isCompleted = progress.completedIds.includes(lesson.id);
                                return (
                                    <Link
                                        key={lesson.id}
                                        href={`/classroom/${course.id}?lessonId=${lesson.id}`}
                                        className={`flex items-start gap-3 p-3 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {isCompleted
                                                ? <CheckCircle className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-green-500'}`} />
                                                : <Circle className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                            }
                                        </div>
                                        <div className="text-sm min-w-0">
                                            <p className={`truncate ${isActive ? "font-medium" : isCompleted ? "text-muted-foreground line-through" : "text-muted-foreground"}`}>
                                                {j + 1}. {lesson.title}
                                            </p>
                                            <p className="text-xs mt-0.5 opacity-70">
                                                {lesson.duration > 0 ? `${Math.floor(lesson.duration / 60)}:${(lesson.duration % 60).toString().padStart(2, '0')}` : 'Video'}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}
