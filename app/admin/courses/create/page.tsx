"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { courseCategories, courseLevels, courseSchema, CourseSchemaType, courseStatuses } from "@/lib/zodSchemas";
import { ArrowLeft, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/drag-drop-file-uploader/Uploader";

export default function CourseCreationPage() {
    // step 1 . Form Defined use shadcn form docs   
    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "",
            description: "",
            fileKey: "",
            price: 1,
            duration: 1,
            level: "Beginner",
            category: "Health & Fitness",
            smallDescription: "",
            slug: "",
            status: "Draft",

        },
    })

    function onSubmit(data: CourseSchemaType) {
        toast("You submitted the following values:", {
            description: (
                <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
                    <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
            position: "bottom-right",
            classNames: {
                content: "flex flex-col gap-2",
            },
            style: {
                "--border-radius": "calc(var(--radius)  + 4px)",
            } as React.CSSProperties,
        })
    }
    return (
        <>
            <div className="flex items-center gap-4">
                <Link href="/admin/courses" className={buttonVariants({
                    variant: "outline",

                })}>
                    <ArrowLeft className="size-4" />
                    Back to Courses
                </Link>
                <h1 className="text-2xl font-bold">Create Course</h1>


            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Provide basic information about course</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Title */}
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
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
                                            <Input placeholder="Slug" {...field} />
                                        </FormControl>
                                        <FormMessage />

                                    </FormItem>
                                )} />
                                <Button type="button" className="w-fit" onClick={() => {
                                    const titleValue = form.getValues("title")
                                    if (!titleValue) {
                                        toast.error("Please enter a title")
                                        return
                                    }
                                    const slugValue = slugify(titleValue, { lower: true, strict: true })
                                    form.setValue("slug", slugValue, { shouldValidate: true })
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
                                        <Textarea placeholder="Small Description" {...field} className="min-h-[120px]" />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )} />
                            {/* Description  */}
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        {/* <Textarea placeholder="Description" {...field} className="min-h-[120px]" /> */}
                                        <RichTextEditor content={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )} />
                            {/* Image Uploader */}
                            <FormField control={form.control} name="fileKey" render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Thumbnail Image</FormLabel>
                                    <Uploader />
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
                                                    <SelectValue placeholder="Select Value" />
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
                            <Button type="submit">
                                Create Course
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}