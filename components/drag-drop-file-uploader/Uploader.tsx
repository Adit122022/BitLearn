"use client"

import { useCallback, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import { RenderEmptyState, RenderPreviewState } from './RenderState'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';
import { Progress } from '../ui/progress'

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key: string | null;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: "image" | "video" | "pdf";
}

interface UploaderProps {
    onUploadComplete?: (key: string) => void;
    value?: string;
    acceptType?: "image" | "video";
    courseName?: string;
}

export default function Uploader({ onUploadComplete, value, acceptType = "image", courseName }: UploaderProps) {
    const [fileState, setFileState] = useState<UploaderState>({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        key: value || null,
        isDeleting: false,
        error: false,
        objectUrl: value || undefined,
        fileType: "image",
    })

    async function uploadFile(file: File) {
        setFileState((prev) => ({ ...prev, uploading: true, progress: 0 }));

        try {
            // 1. Get presigned URL
            const fileType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "pdf";
            
            const res = await fetch("/api/s3/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    isImage: fileType === "image",
                    courseName
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to get upload URL");
            }

            const { presignedUrl, fileKey } = await res.json();

            // 2. Upload to S3 using XHR to track progress
            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        setFileState((prev) => ({ ...prev, progress }));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        reject(new Error("Failed to upload file to S3"));
                    }
                };

                xhr.onerror = () => reject(new Error("Network Error occurred"));
                
                xhr.open("PUT", presignedUrl);
                xhr.setRequestHeader("Content-Type", file.type);
                xhr.send(file);
            });

            // 3. Update state on success
            setFileState((prev) => ({ ...prev, uploading: false, progress: 100, key: fileKey }));
            toast.success("File uploaded successfully!");
            
            // Call the callback to inform parent component (e.g. valid fileKey for DB)
            if (onUploadComplete) {
                onUploadComplete(fileKey);
            }

        } catch (error: any) {
            console.error("Upload error:", error);
            setFileState((prev) => ({ ...prev, uploading: false, error: true }));
            toast.error(error.message || "Something went wrong during upload");
        }
    }

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const previewUrl = URL.createObjectURL(file);
            const fileType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "pdf";
            
            setFileState({
                id: uuidv4(),
                file,
                uploading: false,
                progress: 0,
                key: null,
                isDeleting: false,
                error: false,
                objectUrl: previewUrl,
                fileType,
            });
           
            // Start upload automatically
            uploadFile(file);
        }
    };

    function onDropRejected(filesRejection: FileRejection[]) {
        if (filesRejection.length) {
            const rejected = filesRejection[0];
            const errorCode = rejected.errors[0].code;

            if (errorCode === "too-many-files") {
                toast.error("Too many files. Maximum is 1.");
            } else if (errorCode === "file-too-large") {
                toast.error(`File is too large. Maximum is ${acceptType === "image" ? "5MB" : "1GB"}.`);
            } else if (errorCode === "file-invalid-type") {
                toast.error(`Invalid file type. Please upload a ${acceptType}.`);
            } else {
                toast.error(rejected.errors[0].message);
            }
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptType === "image" 
            ? { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] }
            : { "video/*": [".mp4", ".mov", ".avi", ".webm"] },
        maxFiles: 1,
        maxSize: acceptType === "image" ? 5 * 1024 * 1024 : 1000 * 1024 * 1024,
        multiple: false,
        onDropRejected,
    });

    const handleRemove = () => {
        setFileState({
            id: null,
            file: null,
            uploading: false,
            progress: 0,
            key: null,
            isDeleting: false,
            error: false,
            objectUrl: undefined,
            fileType: "image",
        });
        if (onUploadComplete) {
            onUploadComplete("");
        }
    }

    return (
        <Card
            {...getRootProps()}
            className={cn("relative border-2 border-dashed transition-all duration-300 ease-in-out w-full cursor-pointer min-h-[200px] flex items-center justify-center overflow-hidden",
                isDragActive ? "border-primary bg-primary/5 border-solid scale-[1.01]" : "border-border border-dashed hover:border-primary/50 hover:bg-muted/30")}
        >
            <CardContent className='flex items-center justify-center w-full p-0 h-full relative'>
                <input {...getInputProps()} />

                {fileState.objectUrl ? (
                    <RenderPreviewState value={fileState.objectUrl} handleRemove={handleRemove} />
                ) : (
                    <RenderEmptyState isDragActive={isDragActive} />
                )}
                
                {fileState.uploading && (
                    <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center p-6 backdrop-blur-sm z-10">
                        <span className="text-sm font-medium mb-4">Uploading... {fileState.progress}%</span>
                        <Progress value={fileState.progress} className="w-full max-w-[200px]" />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}


