import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostForm } from "../PostForm";
import { updatePost } from "../actions";

export const metadata = { title: "Yazıyı Düzenle" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">Yazıyı Düzenle</h1>
      <div className="mt-6">
        <PostForm initial={post} onSubmit={updatePost.bind(null, id)} />
      </div>
    </div>
  );
}
