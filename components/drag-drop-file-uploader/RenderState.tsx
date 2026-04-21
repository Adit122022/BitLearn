

import { cn } from '@/lib/utils';
import { CloudUploadIcon, ImageIcon, XIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button';

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
    return (
        <div className='text-center w-full flex flex-col h-full justify-center items-center space-y-2'>
            <div className=' mx-auto flex justify-center items-center size-12 rounded-full bg-muted mb-4'>
                <CloudUploadIcon className={cn(
                    "size-6 text-muted-foreground",
                    isDragActive && "text-primary"
                )} />
            </div>
            <p className='text-base text-muted-foreground'>Drop your files here or <span className='text-primary'>click to upload</span></p>
            <Button type="button" variant="ghost">Browse Files</Button>
        </div>
    )
}

export function RenderErrorState({ error }: { error: string }) {
    return (
        <div className='text-destructive  w-full flex flex-col h-full justify-center items-center'>
            <div className=' mx-auto flex justify-center items-center size-12 rounded-full bg-destructive/10 mb-4'>
                <ImageIcon className={cn(
                    "size-8 text-destructive",
                )} />
            </div>
            <p className='text-base text-destructive mt-2'>{error}</p>
            <Button type="button" variant="ghost">Browse Files</Button>
        </div>
    )
}

export function RenderPreviewState({ value, handleRemove }: { value: string, handleRemove: () => void }) {
    return (
        <div className='relative w-full h-full flex flex-col items-center justify-center p-4'>
            <div className='relative group'>
                <img
                    src={value}
                    alt="Preview"
                    className='max-h-[300px] w-auto rounded-lg object-contain shadow-md transition-all duration-300 group-hover:opacity-90'
                />
                <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className='absolute -top-2 -right-2 size-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
                    }}
                >
                    <XIcon className='size-4' />
                </Button>
            </div>
            <p className='text-sm text-muted-foreground mt-4'>Click or drag to change image</p>
        </div>
    )
}