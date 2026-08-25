-- 12. Yargı Paketi yazısına İngilizce çeviri ve kapak görseli ekler.
-- meta_title/meta_description TR''ye özel olduğu için temizleniyor, böylece
-- her dil kendi title_*/excerpt_* alanına düşer (aksi halde İngilizce
-- sayfada da Türkçe SEO başlığı görünürdü).
update public.posts set
  title_en = 'What Is the 12th Judicial Package? Changes Introduced by Law No. 7589',
  excerpt_en = 'We''ve summarized the key changes brought by Law No. 7589, in force since July 31, 2026: reduced penalties for IBAN fraud accomplices, changes to suspended judgments (HAGB), the removal of the indeterminate-value claim, and more.',
  content_en = '<p>Widely known as the “12th Judicial Package,” officially titled the <em>“Law on Amendments to Certain Laws for the Effective and Efficient Functioning of the Judiciary,”</em> this reform was published as <strong>Law No. 7589</strong> in the Official Gazette on July 31, 2026, and entered into force on the same day. Consisting of 29 articles and 1 provisional article, three of its articles (11, 12 and 22) will take effect on October 31, 2026.</p>

<h2>What Is the Purpose of the 12th Judicial Package?</h2>
<p>The package''s main goal is to reduce the procedural bottlenecks that delay cases for years before their merits are even addressed. Prolonged litigation is widely seen as a serious source of lost rights and unpredictability for both citizens and businesses. To that end, the Law introduces numerous changes across civil procedure, criminal procedure, enforcement and bankruptcy law, notarial practice, and service-of-process procedures.</p>

<h2>Key Changes</h2>

<h3>1. Turkish Criminal Code Art. 158/4 — Reduced Penalty for IBAN/Account-Information Accomplices</h3>
<p>One of the most discussed provisions is the new fourth paragraph added to Article 158 of the Turkish Criminal Code. Under it, anyone whose involvement in aggravated fraud is limited to providing a bank card, IBAN, or account information now has their sentence <strong>reduced by half</strong>. This is designed to protect people — often described as “IBAN victims” — who unknowingly or under deception let their account be used for fraud, from being punished as severely as the actual perpetrators.</p>

<h3>2. Changes to the Suspension of the Announcement of the Verdict (HAGB)</h3>
<p>Article 231 of the Code of Criminal Procedure, which governs HAGB (suspension of the announcement of the verdict), was revised. Under the new rules, HAGB <strong>can no longer be applied to torture and ill-treatment offenses</strong>.</p>

<h3>3. Removal of the Indeterminate-Value Claim</h3>
<p>Article 107 of the Code of Civil Procedure, which governed the indeterminate-value claim (belirsiz alacak davası), has been removed. In its place, claimants in a partial claim can now make a <strong>one-time increase to their claim amount without needing to formally amend the claim</strong>. This change directly affects the procedure to follow when the exact amount owed cannot be determined at the time the case is filed.</p>

<h3>4. Change to the Statutory Interest Rate</h3>
<p>The statutory interest rate is now indexed to <strong>80% of the Central Bank of the Republic of Türkiye''s rediscount rate</strong>. This directly affects interest calculations in receivable, compensation, and enforcement proceedings.</p>

<h3>5. Improvements to Enforcement, Notarial, and Service-of-Process Procedures</h3>
<p>The package also introduces various procedural improvements to enforcement and bankruptcy law, notarial practice, and service of process, aimed at making it easier for lawyers to access information and documents and speeding up proceedings.</p>

<h2>Is There a General Amnesty?</h2>
<p>One of the most frequently asked questions since the Law came into force is whether it includes a general amnesty. <strong>Law No. 7589 does not include any general amnesty provision.</strong></p>

<h2>Conclusion</h2>
<p>The 12th Judicial Package introduces significant changes that will have a direct practical impact on both criminal and civil proceedings. If you have an ongoing case or are considering filing one, we can assess together how these new rules apply to your specific situation.</p>
<p><em>This article is for general informational purposes only and does not constitute legal advice. Always confirm current legislation with the relevant official sources.</em></p>',
  cover_image_url = '/images/hizmet/idari-hukuku.jpg',
  meta_title = null,
  meta_description = null
where slug = '12-yargi-paketi-nedir';
