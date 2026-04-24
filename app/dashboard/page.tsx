import { getEnrolledCourses } from "@/app/actions/enrollment-actions";
import { getCompletedCourseCount } from "@/app/actions/lesson-progress-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, PlayCircle, Trophy } from "lucide-react";

export default async function DashboardPage() {
    const [enrolledCourses, completedCount] = await Promise.all([
        getEnrolledCourses(),
        getCompletedCourseCount(),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Learning Dashboard</h1>
                <p className="text-muted-foreground mt-2">Welcome back! Pick up where you left off.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Enrolled Courses</p>
                            <h2 className="text-3xl font-bold mt-2">{enrolledCourses.length}</h2>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <PlayCircle className="text-primary w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-green-500/5 border-green-500/20">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Completed Courses</p>
                            <h2 className="text-3xl font-bold mt-2">{completedCount}</h2>
                        </div>
                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="text-green-500 w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/5 border-amber-500/20">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Certificates</p>
                            <h2 className="text-3xl font-bold mt-2">{completedCount}</h2>
                        </div>
                        <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                            <Trophy className="text-amber-500 w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="pt-4">
                <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>

                {enrolledCourses.length === 0 ? (
                    <div className="text-center py-20 bg-card border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                        <Link href="/courses" className={buttonVariants()}>
                            Explore Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map(course => (
                            <Card key={course.id} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all group">
                                <div className="aspect-video w-full bg-muted relative">
                                    {course.imageUrl && (
                                        <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <PlayCircle className="text-white w-12 h-12" />
                                    </div>
                                    {course.progress.percent === 100 && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                            Completed
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                                    <CardDescription>{course.user?.name}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{course.progress.completed} of {course.progress.total} lessons</span>
                                        <span>{course.progress.percent}%</span>
                                    </div>
                                    <Progress value={course.progress.percent} className="h-2" />
                                </CardContent>
                                <CardFooter>
                                    <Link
                                        href={`/classroom/${course.id}`}
                                        className={buttonVariants({ className: "w-full" })}
                                    >
                                        {course.progress.percent > 0 ? "Continue" : "Start"} Course
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
