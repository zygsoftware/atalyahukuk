import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendContactNotification } from "@/lib/email/contact-notification";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot doluysa sessizce başarı dön (bot tespit edildi)
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
  });

  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // Mesaj veritabanına kaydedildi; bildirim maili başarısız olsa bile
  // kullanıcıya hata dönülmez (mesaj admin panelden yine görülebilir).
  try {
    await sendContactNotification(parsed.data);
  } catch (err) {
    console.error("İletişim formu bildirim maili gönderilemedi:", err);
  }

  return NextResponse.json({ ok: true });
}
