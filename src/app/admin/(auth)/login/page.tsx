import Image from "next/image";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Giriş Yap" };

export default function AdminLoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/logo-mark.png"
          alt="Atalya Hukuk Bürosu"
          width={56}
          height={56}
          className="h-14 w-14"
        />
        <h1 className="mt-4 font-serif text-2xl text-cream">
          Yönetim Paneli
        </h1>
        <p className="mt-1 text-sm text-cream/60">
          Devam etmek için giriş yapın
        </p>
      </div>

      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
