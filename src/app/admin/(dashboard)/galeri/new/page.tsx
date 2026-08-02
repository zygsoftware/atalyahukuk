import { NewImageForm } from "../NewImageForm";

export const metadata = { title: "Yeni Galeri Görseli" };

export default function NewGalleryImagePage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">
        Yeni Galeri Görseli
      </h1>
      <div className="mt-6">
        <NewImageForm />
      </div>
    </div>
  );
}
