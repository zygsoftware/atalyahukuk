import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline =
    locale === "tr"
      ? "Haklarınızı Güvenle Savunuyoruz"
      : "Defending Your Rights with Confidence";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#230A0B",
          backgroundImage:
            "radial-gradient(circle at 82% 18%, rgba(163,122,67,0.35), transparent 55%), radial-gradient(circle at 12% 88%, rgba(104,10,15,0.55), transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 999,
            border: "2px solid rgba(163,122,67,0.6)",
          }}
        >
          <span style={{ fontSize: 64, color: "#A37A43", fontWeight: 700 }}>
            A
          </span>
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 64,
            letterSpacing: 10,
            color: "#FAF8F5",
            fontWeight: 600,
          }}
        >
          ATALYA
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 22,
            letterSpacing: 6,
            color: "#A37A43",
            textTransform: "uppercase",
          }}
        >
          {SITE_NAME.replace("Atalya ", "")}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            color: "rgba(250,248,245,0.75)",
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
