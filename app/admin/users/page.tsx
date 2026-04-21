"use client"

import { useEffect, useState } from "react";
import { getAllUsers, deleteUserAndData, revokeTeacherRole, adminDeleteCourse } from "@/app/actions/user-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserX, ShieldBan, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    async function loadData() {
        setIsLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function handleDeleteUser(userId: string) {
        if (!confirm("Are you absolutely sure you want to permanently delete this user and all their data?")) return;
        try {
            await deleteUserAndData(userId);
            toast.success("User deleted successfully.");
            loadData();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    async function handleRevokeTeacher(userId: string) {
        if (!confirm("Revoke teacher access for this user?")) return;
        try {
            await revokeTeacherRole(userId);
            toast.success("Role revoked to STUDENT.");
            loadData();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    async function handleDeleteCourse(courseId: string) {
        if (!confirm("Delete this course permanently?")) return;
        try {
            await adminDeleteCourse(courseId);
            toast.success("Course deleted.");
            loadData();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Platform Directory</CardTitle>
                    <CardDescription>View all users, inspect their courses, and administer platform policies.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-10 opacity-60">Loading users database...</div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-10 opacity-60">No users found.</div>
                    ) : (
                        <div className="space-y-6">
                            {users.map(user => (
                                <div key={user.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    {/* User Details */}
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border">
                                            <AvatarImage src={user.image || ""} />
                                            <AvatarFallback>{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-lg flex items-center gap-2">
                                                {user.name}
                                                {user.role === "ADMIN" && <Badge variant="default" className="bg-red-500/10 text-red-600">ADMIN</Badge>}
                                                {user.role === "TEACHER" && <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600">TEACHER</Badge>}
                                                {(user.role === "STUDENT" || !user.role) && <Badge variant="outline">STUDENT</Badge>}
                                            </div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>

                                    {/* Related Courses (if teacher) */}
                                    {user.courses && user.courses.length > 0 && (
                                        <div className="flex-1 bg-muted/20 border border-dashed rounded-lg p-3">
                                            <div className="text-xs font-semibold mb-2 uppercase text-muted-foreground">Authored Courses ({user.courses.length})</div>
                                            <div className="space-y-2">
                                                {user.courses.map((course: any) => (
                                                    <div key={course.id} className="flex items-center justify-between text-sm bg-background border p-2 rounded">
                                                        <span className="truncate max-w-[200px]">{course.title}</span>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="text-[10px]">{course.status}</Badge>
                                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleDeleteCourse(course.id)}>
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Admin Actions */}
                                    <div className="shrink-0 flex items-center gap-2">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {user.role === "TEACHER" && (
                                                    <DropdownMenuItem onClick={() => handleRevokeTeacher(user.id)} className="text-amber-600">
                                                        <ShieldBan className="w-4 h-4 mr-2"/> Revoke Teacher Access
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                                    <UserX className="w-4 h-4 mr-2"/> Delete Entire User & Data
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
