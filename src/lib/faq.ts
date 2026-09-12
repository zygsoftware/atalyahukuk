// Blog içeriğinde "Sık Sorulan Sorular" bölümü, yazı editöründe her zaman
// aynı düzende yazılır: <h2>{başlık}</h2> ardından art arda gelen
// <h3>Soru</h3><p>Cevap</p> çiftleri, bir sonraki <h2> etikete kadar sürer.
// Bu fonksiyon, ayrı bir veri alanı gerektirmeden bu düzeni ayrıştırıp
// FAQPage yapılandırılmış verisi (JSON-LD) üretmek için kullanılır.

const FAQ_HEADINGS: Record<string, string> = {
  tr: "Sık Sorulan Sorular",
  en: "Frequently Asked Questions",
  ru: "Часто задаваемые вопросы",
};

export interface FaqEntry {
  question: string;
  answer: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractFaqs(html: string | null | undefined, locale: string): FaqEntry[] {
  if (!html) return [];

  const heading = FAQ_HEADINGS[locale] ?? FAQ_HEADINGS.tr;
  const headingRegex = new RegExp(
    `<h2>\\s*${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*</h2>`,
    "i",
  );
  const match = headingRegex.exec(html);
  if (!match) return [];

  const afterHeading = html.slice(match.index + match[0].length);
  const nextH2Index = afterHeading.search(/<h2>/i);
  const section = nextH2Index === -1 ? afterHeading : afterHeading.slice(0, nextH2Index);

  const entries: FaqEntry[] = [];
  const h3Regex = /<h3>(.*?)<\/h3>([\s\S]*?)(?=<h3>|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = h3Regex.exec(section)) !== null) {
    const question = stripHtml(m[1]);
    const answer = stripHtml(m[2]);
    if (question && answer) entries.push({ question, answer });
  }
  return entries;
}
