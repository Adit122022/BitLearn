"use client"
import { type Editor } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import {
    AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold,
    ChevronDown, ChevronUp, Code, Heading1, Heading2, Heading3,
    Heading4, Highlighter, Italic, Link, ListIcon, ListOrdered,
    Minus, PenTool, Quote, Redo, SquareCode, Strikethrough,
    Subscript, Superscript, Underline, Undo
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface iAppProps {
    editor: Editor | null
}

export function MenuBar({ editor }: iAppProps) {
    if (!editor) return null;

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap items-center gap-1 border-b p-2 sticky top-0 bg-[#1a1a1a] text-white z-10">
            <TooltipProvider>
                {/* History Group */}
                <div className="flex items-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="button" size="sm" variant="ghost" className="text-white hover:bg-white/10 h-8 w-8 p-0"
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.can().chain().focus().undo().run()}>
                                <Undo size={16} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="button" size="sm" variant="ghost" className="text-white hover:bg-white/10 h-8 w-8 p-0"
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.can().chain().focus().redo().run()}>
                                <Redo size={16} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>
                </div>

                <div className="h-6 w-px bg-white/20 mx-1" />

                {/* Structure Group */}
                <div className="flex items-center gap-1">
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button type="button" variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8 gap-1 px-2">
                                        <span className="text-sm font-semibold">H</span>
                                        <ChevronDown size={14} />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Headings</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="start" className="bg-[#1a1a1a] border-white/20 text-white">
                            {[1, 2, 3, 4].map((level) => (
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                <DropdownMenuItem key={level} onClick={() => editor.chain().focus().toggleHeading({ level: level as any }).run()} className="hover:bg-white/10 focus:bg-white/10">
                                    {level === 1 && <Heading1 size={16} />}
                                    {level === 2 && <Heading2 size={16} />}
                                    {level === 3 && <Heading3 size={16} />}
                                    {level === 4 && <Heading4 size={16} />}
                                    <span className="ml-2">Heading {level}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button type="button" variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8 gap-1 px-2">
                                        <ListIcon size={16} />
                                        <ChevronDown size={14} />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Lists</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="start" className="bg-[#1a1a1a] border-white/20 text-white">
                            <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()} className="hover:bg-white/10 focus:bg-white/10">
                                <ListIcon size={16} /><span className="ml-2">Bullet List</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()} className="hover:bg-white/10 focus:bg-white/10">
                                <ListOrdered size={16} /><span className="ml-2">Ordered List</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive("blockquote")}
                                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-2", editor.isActive("blockquote") && "bg-white/20 text-white")}>
                                <Quote size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Blockquote</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive("codeBlock")}
                                onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-2", editor.isActive("codeBlock") && "bg-white/20 text-white")}>
                                <SquareCode size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Code Block</TooltipContent>
                    </Tooltip>
                </div>

                <div className="h-6 w-px bg-white/20 mx-1" />

                {/* Inline Group */}
                <div className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive("bold")}
                                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-2", editor.isActive("bold") && "bg-white/20 text-white")}>
                                <Bold size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bold</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive("italic")}
                                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-1.5", editor.isActive("italic") && "bg-white/20 text-white")}>
                                <Italic size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Italic</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive("strike")}
                                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-1.5", editor.isActive("strike") && "bg-white/20 text-white")}>
                                <Strikethrough size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Strike</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive("code")}
                                onPressedChange={() => editor.chain().focus().toggleCode().run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-1.5", editor.isActive("code") && "bg-white/20 text-white")}>
                                <Code size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Inline Code</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive("underline")}
                                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-1.5", editor.isActive("underline") && "bg-white/20 text-white")}>
                                <Underline size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Underline</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive("highlight")}
                                onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-1.5", editor.isActive("highlight") && "bg-white/20 text-white")}>
                                <PenTool size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Highlight</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive("link")}
                                onPressedChange={setLink}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-1.5", editor.isActive("link") && "bg-white/20 text-white")}>
                                <Link size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Link</TooltipContent>
                    </Tooltip>
                </div>

                <div className="h-6 w-px bg-white/20 mx-1" />

                {/* Sub/Super Group */}
                <div className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive("superscript")}
                                onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-1.5", editor.isActive("superscript") && "bg-white/20 text-white")}>
                                <Superscript size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Superscript</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive("subscript")}
                                onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-1.5", editor.isActive("subscript") && "bg-white/20 text-white")}>
                                <Subscript size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Subscript</TooltipContent>
                    </Tooltip>
                </div>

                <div className="h-6 w-px bg-white/20 mx-1" />

                {/* Alignment Group */}
                <div className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive({ textAlign: "left" })}
                                onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-1.5", editor.isActive({ textAlign: "left" }) && "bg-white/20 text-white")}>
                                <AlignLeft size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Left Align</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive({ textAlign: "center" })}
                                onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-1.5", editor.isActive({ textAlign: "center" }) && "bg-white/20 text-white")}>
                                <AlignCenter size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Center Align</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive({ textAlign: "right" })}
                                onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-1.5", editor.isActive({ textAlign: "right" }) && "bg-white/20 text-white")}>
                                <AlignRight size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Right Align</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle type="button" size="sm" pressed={editor.isActive({ textAlign: "justify" })}
                                onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
                                className={cn("text-white hover:bg-white/10 h-8 w-8 p-0 px-1.5", editor.isActive({ textAlign: "justify" }) && "bg-white/20 text-white")}>
                                <AlignJustify size={16} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Justify Align</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    )
}
