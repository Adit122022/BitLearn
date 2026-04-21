"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Pencil, Trash2, Video, Lock, Unlock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Uploader from "@/components/drag-drop-file-uploader/Uploader";
import { createModule, deleteModule, createLesson, deleteLesson } from "@/app/actions/module-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CurriculumManagerClient({ course }: { course: any }) {
    const router = useRouter();
    const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [newModulePublic, setNewModulePublic] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [lessonDialogOpen, setLessonDialogOpen] = useState<string | null>(null);
    const [newLessonTitle, setNewLessonTitle] = useState("");
    const [newLessonVideoKey, setNewLessonVideoKey] = useState("");

    async function handleAddModule(e: React.FormEvent) {
        e.preventDefault();
        if (!newModuleTitle.trim()) return;
        setIsLoading(true);
        try {
            await createModule(course.id, { title: newModuleTitle, isPublic: newModulePublic });
            toast.success("Module created");
            setNewModuleTitle("");
            setIsModuleDialogOpen(false);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeleteModule(moduleId: string) {
        if (!confirm("Are you sure you want to delete this module and ALL its lessons?")) return;
        try {
            await deleteModule(moduleId);
            toast.success("Module deleted");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    async function handleAddLesson(e: React.FormEvent, moduleId: string) {
        e.preventDefault();
        if (!newLessonTitle.trim()) return;
        setIsLoading(true);
        try {
            await createLesson(moduleId, { title: newLessonTitle, videoKey: newLessonVideoKey });
            toast.success("Lesson created");
            setNewLessonTitle("");
            setNewLessonVideoKey("");
            setLessonDialogOpen(null);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeleteLesson(lessonId: string) {
        if (!confirm("Delete this lesson?")) return;
        try {
            await deleteLesson(lessonId);
            toast.success("Lesson deleted");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
                <div>
                    <CardTitle>Course Modules</CardTitle>
                    <CardDescription>Manage the sections and video lessons of this course.</CardDescription>
                </div>
                <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="w-4 h-4 mr-2" /> Add Module</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a New Module</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddModule} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Module Title</Label>
                                <Input 
                                    value={newModuleTitle} 
                                    onChange={e => setNewModuleTitle(e.target.value)} 
                                    placeholder="e.g. Introduction to React" 
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch 
                                    checked={newModulePublic} 
                                    onCheckedChange={setNewModulePublic} 
                                    id="public-toggle" 
                                />
                                <Label htmlFor="public-toggle">Free Preview (Public Module)</Label>
                            </div>
                            <Button type="submit" disabled={isLoading} className="w-full">Create Module</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {course.modules.length === 0 ? (
                    <div className="text-center py-10 bg-muted/20 border border-dashed rounded-lg">
                        <p className="text-muted-foreground">No modules yet. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {course.modules.map((mod: any, index: number) => (
                            <div key={mod.id} className="border rounded-lg bg-card overflow-hidden">
                                <div className="bg-muted/40 p-4 border-b flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                                        <div className="font-semibold text-lg">Section {index + 1}: {mod.title}</div>
                                        {mod.isPublic ? <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20"><Unlock className="w-3 h-3 mr-1"/> Free Preview</Badge> : <Badge variant="outline"><Lock className="w-3 h-3 mr-1"/> Locked</Badge>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteModule(mod.id)}>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="divide-y text-sm">
                                    {mod.lessons.map((lesson: any, lIndex: number) => (
                                        <div key={lesson.id} className="p-3 pl-12 flex items-center justify-between hover:bg-muted/20 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
                                                <Video className="w-4 h-4 text-primary" />
                                                <span className="font-medium">Lesson {lIndex + 1}: {lesson.title}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {lesson.videoKey ? (
                                                    <Badge variant="secondary" className="font-mono text-xs max-w-[150px] truncate">
                                                        {lesson.videoKey.split('-').pop()}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground italic text-xs">No video</span>
                                                )}
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteLesson(lesson.id)} className="h-8 w-8 p-0 text-destructive">
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="p-3 pl-12 bg-muted/10">
                                        <Dialog open={lessonDialogOpen === mod.id} onOpenChange={(open) => setLessonDialogOpen(open ? mod.id : null)}>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                                                    <Plus className="w-4 h-4 mr-1" /> Add Lesson
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Lesson to: {mod.title}</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={(e) => handleAddLesson(e, mod.id)} className="space-y-4 pt-4">
                                                    <div className="space-y-2">
                                                        <Label>Lesson Title</Label>
                                                        <Input 
                                                            value={newLessonTitle} 
                                                            onChange={e => setNewLessonTitle(e.target.value)} 
                                                            placeholder="e.g. Setting up the environment" 
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Lesson Video (Optional)</Label>
                                                        <Uploader onUploadComplete={setNewLessonVideoKey} value={newLessonVideoKey} acceptType="video" courseName={course.title} />
                                                        <p className="text-xs text-muted-foreground">The platform currently supports uploading to S3 directly.</p>
                                                    </div>
                                                    <Button type="submit" disabled={isLoading} className="w-full">Save Lesson</Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
