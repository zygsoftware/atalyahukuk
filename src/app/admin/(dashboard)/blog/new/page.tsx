import { PostForm } from "../PostForm";
import { createPost } from "../actions";

export const metadata = { title: "Yeni Blog Yazısı" };

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">Yeni Blog Yazısı</h1>
      <div className="mt-6">
        <PostForm onSubmit={createPost} />
      </div>
    </div>
  );
}
