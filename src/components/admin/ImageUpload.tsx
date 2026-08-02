"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export function ImageUpload({
  value,
  onChange,
  folder,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${folder}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("media")
        .upload(path, file);
      if (error || !data) return;
      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(data.path);
      onChange(publicUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-bordo-100">
          <Image src={value} alt="Kapak görseli" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 rounded-full bg-bordo-950/70 px-2.5 py-1 text-xs font-medium text-cream"
          >
            Kaldır
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-video w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-bordo-200 text-sm text-ink/50 transition hover:border-bordo-400 disabled:opacity-60"
        >
          {uploading ? "Yükleniyor..." : "Görsel Yükle"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
