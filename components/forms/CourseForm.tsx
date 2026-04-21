"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { courseCategories, courseLevels, courseSchema, CourseSchemaType, courseStatuses } from "@/lib/zodSchemas";
import { SparklesIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/drag-drop-file-uploader/Uploader";
import { useState } from "react";

interface CourseFormProps {
    defaultValues: CourseSchemaType;
    onSubmitAction: (data: CourseSchemaType) => Promise<void>;
    submitButtonText?: string;
}

export default function CourseForm({ defaultValues, onSubmitAction, submitButtonText = "Save Course" }: CourseFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CourseSchemaType>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(courseSchema) as any,
        defaultValues,
    });

    async function onSubmit(data: CourseSchemaType) {
        setIsLoading(true);
        try {
            await onSubmitAction(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="Course Title" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="flex items-end gap-2">
                    {/* Slug */}
                    <FormField control={form.control} name="slug" render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="course-slug" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="button" className="w-fit" onClick={() => {
                        const titleValue = form.getValues("title");
                        if (!titleValue) {
                            toast.error("Please enter a title");
                            return;
                        }
                        const slugValue = slugify(titleValue, { lower: true, strict: true });
                        form.setValue("slug", slugValue, { shouldValidate: true });
                    }}>
                        <SparklesIcon className="size-4" />
                        Generate Slug
                    </Button>
                </div>

                {/* small Description */}
                <FormField control={form.control} name="smallDescription" render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Small Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="A brief overview of the course..." {...field} className="min-h-[100px]" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                {/* Description  */}
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Course Content</FormLabel>
                        <FormControl>
                            <RichTextEditor content={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                {/* Image Uploader */}
                <FormField control={form.control} name="fileKey" render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Thumbnail Image</FormLabel>
                        <Uploader onUploadComplete={field.onChange} value={field.value} courseName={form.watch("title")} />
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* category */}
                    <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {courseCategories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* level */}
                    <FormField control={form.control} name="level" render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Level" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {courseLevels.map((level) => (
                                        <SelectItem key={level} value={level}>
                                            {level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Duration */}
                    <FormField control={form.control} name="duration" render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Duration (hours)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Duration" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Price */}
                    <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Price (₹)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Price" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                {/* Status */}
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {courseStatuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="pt-4 border-t">
                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                        {isLoading ? "Saving..." : submitButtonText}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
