import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { getTeacherCourses } from "@/app/actions/course-actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, LayoutList, User } from "lucide-react";

export default async function CoursesPage() {
    const courses = await getTeacherCourses();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">All Courses</h1>
                <Link className={buttonVariants()} href="/admin/courses/create">
                    Add Course
                </Link>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-10 bg-muted/20 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">No courses found in the platform yet.</p>
                    <Link className={buttonVariants({ variant: "outline" })} href="/admin/courses/create">
                        Create First Course
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <Card key={course.id} className="flex flex-col h-full overflow-hidden">
                            <div className="aspect-video w-full relative bg-muted">
                                {course.imageUrl ? (
                                    <img src={course.imageUrl} alt={course.title} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <Badge variant={course.status === "Published" ? "default" : "secondary"}>
                                        {course.status}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{course.smallDescription}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>₹{course.price}</span>
                                    <span>{course.modules.length} Modules</span>
                                </div>
                                {(course as any).user && (
                                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                                        <User className="w-3 h-3" />
                                        <span>{(course as any).user.name || (course as any).user.email}</span>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Link
                                    href={`/admin/courses/${course.id}`}
                                    className={buttonVariants({ variant: "outline", size: "sm", className: "w-full flex-1" })}
                                >
                                    <Edit2 className="w-4 h-4 mr-2" /> Edit Info
                                </Link>
                                <Link
                                    href={`/admin/courses/${course.id}/modules`}
                                    className={buttonVariants({ variant: "outline", size: "sm", className: "w-full flex-1" })}
                                >
                                    <LayoutList className="w-4 h-4 mr-2" /> Curriculum
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}