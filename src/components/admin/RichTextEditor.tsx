"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

function ToolbarButton({
  onClick,
  active,
  children,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-md px-2.5 py-1.5 text-sm font-medium transition",
        active ? "bg-bordo-500 text-cream" : "text-ink/70 hover:bg-bordo-50",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "İçeriği yazın..." }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[280px] px-4 py-3 focus:outline-none prose-headings:font-serif",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  async function handleImageUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      const supabase = createClient();
      const path = `posts/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("media")
        .upload(path, file);
      if (error || !data) return;
      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(data.path);
      editor.chain().focus().setImage({ src: publicUrl }).run();
    };
    input.click();
  }

  function setLink() {
    const url = window.prompt("Bağlantı URL'si");
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
      return;
    }
    editor?.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-bordo-100 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-bordo-100 bg-bordo-50/50 px-2 py-1.5">
        <ToolbarButton
          label="Kalın"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          label="İtalik"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          label="Başlık 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label="Başlık 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          label="Madde İşaretli Liste"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •—
        </ToolbarButton>
        <ToolbarButton
          label="Numaralı Liste"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          label="Alıntı"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          &ldquo;
        </ToolbarButton>
        <ToolbarButton label="Bağlantı" onClick={setLink}>
          🔗
        </ToolbarButton>
        <ToolbarButton label="Görsel Ekle" onClick={handleImageUpload}>
          🖼
        </ToolbarButton>
        <ToolbarButton
          label="Geri Al"
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↺
        </ToolbarButton>
        <ToolbarButton
          label="Yinele"
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↻
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
