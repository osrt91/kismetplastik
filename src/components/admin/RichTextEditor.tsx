"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Code,
  Minus,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, isActive, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded transition-colors ${
        isActive
          ? "bg-amber-500/20 text-amber-400"
          : "text-slate-400 hover:bg-slate-600 hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-slate-600" />;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          class: "text-amber-400 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
      Underline,
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none min-h-[300px] px-4 py-3 outline-none text-slate-200 prose-headings:text-slate-100 prose-p:text-slate-300 prose-strong:text-slate-100 prose-a:text-amber-400 prose-blockquote:border-amber-500/50 prose-blockquote:text-slate-400 prose-code:text-amber-300 prose-code:bg-slate-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-li:text-slate-300 prose-hr:border-slate-600 prose-img:rounded-lg",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync external content changes (e.g., when post loads)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
    // Only run when content prop changes from outside, not on every editor update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Link URL:", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;

    const url = window.prompt("Görsel URL:", "https://");
    if (!url) return;

    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="min-h-[350px] animate-pulse rounded-lg border border-slate-600 bg-slate-800" />
    );
  }

  const charCount = editor.storage.characterCount?.characters?.() ?? editor.getText().length;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-600 bg-slate-800">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-600 bg-slate-800/80 px-2 py-1.5">
        {/* Block */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Başlık 2 (H2)"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Başlık 3 (H3)"
        >
          <Heading3 size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Inline */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Kalın (Ctrl+B)"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="İtalik (Ctrl+I)"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Altı Çizili (Ctrl+U)"
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Üstü Çizili"
        >
          <Strikethrough size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* List */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Madde Listesi"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numaralı Liste"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Media */}
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="Link Ekle"
        >
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={addImage}
          title="Görsel Ekle (URL)"
        >
          <ImageIcon size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Block extras */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Alıntı"
        >
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Kod Bloku"
        >
          <Code size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Yatay Çizgi"
        >
          <Minus size={16} />
        </ToolbarButton>

        {/* Character count */}
        <div className="ml-auto text-xs text-slate-500">
          {charCount} karakter
        </div>
      </div>

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className={!content && placeholder ? "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-slate-500 [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0" : ""}
      />
    </div>
  );
}
