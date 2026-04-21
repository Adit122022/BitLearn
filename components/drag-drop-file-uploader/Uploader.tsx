"use client"

import { useCallback, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import { RenderEmptyState, RenderPreviewState } from './RenderState'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';



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


export default function Uploader() {
    const [fileState, setFileState] = useState<UploaderState>({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        key: null,
        isDeleting: false,
        error: false,
        objectUrl: undefined,
        fileType: "image",
    })

function  uploadFile(file:File){
    setFileState((prev)=>({...prev,uploading:true ,progress:0}));

    try {
        
    } catch (error) {
        
    }
}

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            // Convert file to preview URL. In a real app, you would upload to a server here.
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
            })
           
            toast.success("Image selected successfully");
        }
    }, [])

    function onDropRejected(filesRejection: FileRejection[]) {
        if (filesRejection.length) {
            const rejected = filesRejection[0];
            const errorCode = rejected.errors[0].code;

            if (errorCode === "too-many-files") {
                toast.error("Too many files. Maximum is 1.");
            } else if (errorCode === "file-too-large") {
                toast.error("File is too large. Maximum is 5MB.");
            } else if (errorCode === "file-invalid-type") {
                toast.error("Invalid file type. Please upload an image.");
            } else {
                toast.error(rejected.errors[0].message);
            }
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024, // 5 mb
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
    }

    return (
        <Card
            {...getRootProps()}
            className={cn("relative border-2 border-dashed transition-all duration-300 ease-in-out w-full cursor-pointer min-h-[200px] flex items-center justify-center",
                isDragActive ? "border-primary bg-primary/5 border-solid scale-[1.01]" : "border-border border-dashed hover:border-primary/50 hover:bg-muted/30")}
        >
            <CardContent className='flex items-center justify-center w-full p-0'>
                <input {...getInputProps()} />

                {fileState.objectUrl ? (
                    <RenderPreviewState value={fileState.objectUrl} handleRemove={handleRemove} />
                ) : (
                    <RenderEmptyState isDragActive={isDragActive} />
                )}
            </CardContent>
        </Card>
    )
}

