"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Shield, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;
    }

    if (!session) {
        return <div className="p-8 text-center text-destructive">Failed to load profile session.</div>;
    }

    const { user } = session;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Profile Card Sidebar */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4 relative">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                                    <AvatarImage src={user.image || ""} alt={user.name} />
                                    <AvatarFallback className="text-3xl bg-primary/10 text-primary">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <Button size="icon" variant="secondary" className="absolute bottom-0 right-1/2 translate-x-10 rounded-full h-8 w-8 shadow-sm">
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                            
                            <div className="mt-4 flex justify-center">
                                <Badge variant="secondary" className="px-4 py-1 text-sm bg-primary/10 text-primary flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    {(user as any).role || "STUDENT"}
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                {/* Profile Settings Form */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal details here.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground"/> Full Name
                                </label>
                                <Input defaultValue={user.name} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground"/> Email Address
                                </label>
                                <Input defaultValue={user.email} disabled />
                                <p className="text-xs text-muted-foreground">Your email address is managed by your authentication provider and cannot be changed here.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4 bg-muted/20">
                            <Button className="ml-auto">Save Changes</Button>
                        </CardFooter>
                    </Card>

                    {/* Preference / Security mock */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your account security.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
                                <div>
                                    <p className="font-medium">Password</p>
                                    <p className="text-sm text-muted-foreground">Set a unique password to protect your account.</p>
                                </div>
                                <Button variant="outline">Update</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
                                <div>
                                    <p className="font-medium text-destructive">Danger Zone</p>
                                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                                </div>
                                <Button variant="destructive">Delete Account</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
