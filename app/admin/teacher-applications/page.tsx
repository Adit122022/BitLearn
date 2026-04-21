"use client"

import { useEffect, useState } from "react";
import { getPendingApplications, approveTeacher, rejectTeacher } from "@/app/actions/teacher-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export default function TeacherApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setIsLoading(true);
        try {
            const data = await getPendingApplications();
            setApplications(data);
        } catch (error) {
            toast.error("Failed to load applications");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAction(id: string, action: "approve" | "reject") {
        try {
            if (action === "approve") {
                await approveTeacher(id);
                toast.success("Teacher approved");
            } else {
                await rejectTeacher(id);
                toast.success("Application rejected");
            }
            // Remove from list
            setApplications(prev => prev.filter(app => app.id !== id));
        } catch (error: any) {
            toast.error(error.message || "Failed to process application");
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Teacher Applications</h1>
                <p className="text-muted-foreground">Review and approve user requests to become an instructor.</p>
            </div>

            {isLoading ? (
                <div className="text-center py-10">Loading applications...</div>
            ) : applications.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No pending applications right now.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map(app => (
                        <Card key={app.id}>
                            <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                                    <Avatar className="w-20 h-20 shadow-md">
                                        <AvatarImage src={app.user?.image} />
                                        <AvatarFallback>{app.user?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-center">
                                        <p className="font-semibold">{app.user?.name}</p>
                                        <p className="text-xs text-muted-foreground break-all max-w-[150px]">{app.user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Application Bio</h3>
                                        <p className="text-sm leading-relaxed bg-muted/40 p-4 rounded-md border">{app.bio}</p>
                                    </div>
                                    <div className="flex items-center gap-3 justify-end pt-2">
                                        <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleAction(app.id, "reject")}>
                                            <X className="w-4 h-4 mr-2" /> Reject
                                        </Button>
                                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction(app.id, "approve")}>
                                            <Check className="w-4 h-4 mr-2" /> Approve
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
