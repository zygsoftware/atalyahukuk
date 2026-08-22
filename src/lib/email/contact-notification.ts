import nodemailer from "nodemailer";
import type { ContactInput } from "@/lib/validation/contact";

// Natro (cPanel) gibi standart SMTP mail kutuları için gönderim yardımcısı.
// Gerekli ortam değişkenleri .env.example içinde açıklanmıştır.
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE !== "false", // 465 için true, 587 için false
    auth: { user, pass },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendContactNotification(data: ContactInput) {
  const transporter = getTransporter();
  if (!transporter) {
    // SMTP ayarlanmamışsa sessizce atla — mesaj yine de veritabanına kaydedildi.
    console.warn(
      "SMTP ortam değişkenleri eksik, iletişim formu bildirimi gönderilemedi.",
    );
    return;
  }

  const to = process.env.CONTACT_NOTIFICATION_EMAIL || "info@atalyahukuk.com";
  const from = process.env.SMTP_USER!;

  await transporter.sendMail({
    from: `"Atalya Hukuk Bürosu Web Sitesi" <${from}>`,
    to,
    replyTo: data.email,
    subject: `Yeni İletişim Formu Mesajı — ${data.name}`,
    text: [
      `Ad Soyad: ${data.name}`,
      `E-posta: ${data.email}`,
      `Telefon: ${data.phone || "-"}`,
      "",
      "Mesaj:",
      data.message,
    ].join("\n"),
    html: `
      <p><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>E-posta:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(data.phone || "-")}</p>
      <p><strong>Mesaj:</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, "<br />")}</p>
    `,
  });
}
