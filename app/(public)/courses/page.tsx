import { getPublicCourses } from "@/app/actions/course-actions";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

export default async function PublicCoursesPage() {
    const courses = await getPublicCourses();

    return (
        <div className="py-12 space-y-8 max-w-7xl mx-auto">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight">Explore Courses</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Discover top-tier courses created by industry experts and start your learning journey today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
                {courses.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                        No published courses found. Check back later!
                    </div>
                ) : (
                    courses.map(course => (
                        <Card key={course.id} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all group">
                            <div className="aspect-video w-full relative bg-muted overflow-hidden">
                                {course.imageUrl ? (
                                    <img
                                        src={course.imageUrl}
                                        alt={course.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                                )}
                                <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm pointer-events-none">
                                    {course.category}
                                </Badge>
                                <Badge variant="secondary" className="absolute top-3 right-3 pointer-events-none bg-primary text-primary-foreground">
                                    {course.level}
                                </Badge>
                            </div>
                            <CardHeader className="flex-grow">
                                <CardTitle className="line-clamp-2 leading-snug">{course.title}</CardTitle>
                                <CardDescription className="line-clamp-2 mt-2">{course.smallDescription}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen className="w-4 h-4" /> {/* Lessons Placeholder */}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" /> {course.duration}h
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between border-t pt-4">
                                <div className="font-bold text-lg">
                                    {course.price === 0 ? "Free" : `₹${course.price}`}
                                </div>
                                <Link
                                    href={`/courses/${course.slug}`}
                                    className={buttonVariants({ variant: "default", size: "sm", className: "rounded-full px-4" })}
                                >
                                    View Course
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
