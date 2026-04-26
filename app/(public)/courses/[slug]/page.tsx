import { getCourseBySlug } from "@/app/actions/course-actions";
import { checkEnrollment, enrollInCourse } from "@/app/actions/enrollment-actions";
import { notFound, redirect } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Clock, GraduationCap, Layers, PlayCircle, Unlock, Lock, Building2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sanitizeHtml } from "@/lib/sanitize";
import { prisma } from "@/lib/db";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const p = await params;
    const course = await getCourseBySlug(p.slug);
    if (!course || course.status !== "Published") notFound();

    const isEnrolled = await checkEnrollment(course.id);
    const session = await auth.api.getSession({ headers: await headers() });

    const isCreator = session?.user?.id === course.userId;
    let isUniversityTeacher = false;
    if (session?.user?.id && course.universityId) {
        const teacherRecord = await prisma.universityTeacher.findUnique({
            where: {
                userId_universityId: {
                    userId: session.user.id,
                    universityId: course.universityId,
                },
            },
        });
        isUniversityTeacher = !!teacherRecord;
    }

    async function handleEnrollment() {
        "use server"
        if (!session) {
            redirect("/login");
        }
        await enrollInCourse(course!.id);
        redirect(`/classroom/${course!.id}`);
    }

    return (
        <div className="py-12 max-w-7xl mx-auto space-y-12">
            
            {/* Hero Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="rounded-full bg-primary/10 border-primary/20 text-primary">{course.category}</Badge>
                        <Badge variant="secondary" className="rounded-full">{course.level}</Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{course.title}</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">{course.smallDescription}</p>
                    
                    <div className="flex items-center gap-4 pt-4 flex-wrap">
                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                            {course.user?.image && <img src={course.user.image} alt="Instructor" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold">{course.user?.name || "Instructor"}</p>
                                {course.university && (
                                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                        University Teacher
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">Course Creator</p>
                        </div>
                        {/* University badge — show course university OR instructor's university affiliation */}
                        {(() => {
                            const uni = course.university ?? course.user?.universityTeacherOf?.[0]?.university
                            if (!uni) return null
                            return (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-xs font-medium text-primary">
                                    <Building2 className="size-3.5" />
                                    {uni.name}
                                </div>
                            )
                        })()}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-24 overflow-hidden border-2 shadow-xl">
                        <div className="aspect-video w-full bg-black relative">
                            {course.imageUrl && <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-80" />}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    <PlayCircle className="w-10 h-10 text-white" />
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div className="text-3xl font-bold">
                                {course.price === 0 ? "Free" : `₹${course.price}`}
                            </div>
                            
                            {isCreator || isUniversityTeacher ? (
                                <Link
                                    href={`/admin/courses/${course.id}`}
                                    className={buttonVariants({ className: "w-full text-lg h-12" })}
                                >
                                    Edit Course
                                </Link>
                            ) : isEnrolled ? (
                                <Link
                                    href={`/classroom/${course.id}`}
                                    className={buttonVariants({ className: "w-full text-lg h-12" })}
                                >
                                    Go to Classroom
                                </Link>
                            ) : (
                                <form action={handleEnrollment}>
                                    <Button type="submit" className="w-full text-lg h-12">
                                        {course.price === 0 ? "Enroll for Free" : "Buy Now"}
                                    </Button>
                                </form>
                            )}
                            
                            <p className="text-center text-sm text-muted-foreground">30-day money-back guarantee</p>
                            
                            <div className="pt-4 border-t space-y-3">
                                <p className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Course Includes:</p>
                                <div className="flex items-center gap-3 text-sm"><Clock className="w-4 h-4 text-primary" /> {course.duration} hours of content</div>
                                <div className="flex items-center gap-3 text-sm"><Layers className="w-4 h-4 text-primary" /> {course.modules.length} comprehensive modules</div>
                                <div className="flex items-center gap-3 text-sm"><GraduationCap className="w-4 h-4 text-primary" /> Certificate of completion</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Description & Curriculum */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">About this course</h2>
                        <div 
                            className="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.description) }}
                        />
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold">Course Curriculum</h2>
                        <div className="space-y-4">
                            {course.modules.length === 0 ? (
                                <p className="text-muted-foreground p-6 rounded-lg bg-muted text-center border-dashed border-2">Curriculum is being prepared.</p>
                            ) : (
                                course.modules.map((mod, index) => (
                                    <div key={mod.id} className="border rounded-lg overflow-hidden bg-card">
                                        <div className="p-4 bg-muted/40 font-semibold flex items-center justify-between">
                                            <span>Section {index + 1}: {mod.title}</span>
                                            {mod.isPublic && <Badge variant="secondary"><Unlock className="w-3 h-3 mr-1"/> Preview</Badge>}
                                        </div>
                                        <div className="divide-y">
                                            {mod.lessons.map((lesson, lIndex) => (
                                                <div key={lesson.id} className="p-4 flex items-center justify-between text-sm hover:bg-muted/30 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        {mod.isPublic ? <PlayCircle className="w-4 h-4 text-primary" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                                                        <span>{lIndex + 1}. {lesson.title}</span>
                                                    </div>
                                                    <span className="text-muted-foreground">{lesson.duration > 0 ? `${Math.floor(lesson.duration/60)}:${(lesson.duration%60).toString().padStart(2, '0')}` : '--:--'}</span>
                                                </div>
                                            ))}
                                            {mod.lessons.length === 0 && (
                                                <div className="p-4 text-sm text-muted-foreground">No lessons added yet.</div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
            
        </div>
    );
}
