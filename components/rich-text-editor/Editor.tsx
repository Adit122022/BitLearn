'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import FontFamily from '@tiptap/extension-font-family'
import { TextStyle } from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import { MenuBar } from './menuBar'

interface iAppProps {
  content?: string;
  onChange?: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: iAppProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      Image,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      })
    ],
    content: content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[300px] cursor-text p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none !w-full !max-w-none',
      },
    },
  });

  return (
    <div className="flex flex-col w-full relative rounded-lg border border-white/20 bg-[#1a1a1a] shadow-xl ring-offset-background focus-within:ring-1 focus-within:ring-white/40 transition-all overflow-hidden">
      <MenuBar editor={editor} />
      <div className="overflow-y-auto max-h-[500px] bg-muted dark:bg-[#0d0d0d]">
        <EditorContent className='w-full' editor={editor} />
      </div>
    </div>
  )
}

export default RichTextEditor;