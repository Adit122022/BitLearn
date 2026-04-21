import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";

export default function ContactUsPage() {
    return (
        <div className="min-h-screen py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <MessageSquare className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Get in Touch</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Have questions about our platform, courses, or enterprise solutions? We're here to help.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-card border shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">Contact Information</CardTitle>
                                <CardDescription>Reach out directly via email or phone.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start gap-4 text-muted-foreground">
                                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-medium text-foreground">Email</p>
                                        <a href="mailto:support@bitlearn.com" className="hover:text-primary transition-colors">support@bitlearn.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 text-muted-foreground">
                                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-medium text-foreground">Phone</p>
                                        <a href="tel:+15551234567" className="hover:text-primary transition-colors">+1 (555) 123-4567</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 text-muted-foreground">
                                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-medium text-foreground">Headquarters</p>
                                        <p>123 Innovation Drive<br/>Tech District<br/>San Francisco, CA 94107</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-2 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-2xl">Send us a message</CardTitle>
                                <CardDescription>Fill out the form below and our team will get back to you within 24 hours.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-6" action="#">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">First name</label>
                                            <Input placeholder="John" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Last name</label>
                                            <Input placeholder="Doe" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input type="email" placeholder="john.doe@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject</label>
                                        <Input placeholder="How can we help you?" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Message</label>
                                        <Textarea placeholder="Please describe your issue or inquiry in detail..." className="min-h-[150px]" required />
                                    </div>
                                    <Button type="submit" className="w-full md:w-auto px-8" size="lg">
                                        Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
