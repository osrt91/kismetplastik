import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `Sen Kısmet Plastik'in AI asistanısın. Kısmet Plastik, 1969'dan beri kozmetik ambalaj sektöründe faaliyet gösteren, Türkiye'nin önde gelen üreticilerinden biridir.

**Şirket Bilgileri:**
- Kuruluş: 1969
- Konum: İkitelli OSB Mah. İPKAS 4A Blok Sok. No:5, Başakşehir/İstanbul
- Telefon: 0212 549 87 03
- E-posta: bilgi@kismetplastik.com
- WhatsApp: 0530 741 75 99
- Sertifikalar: ISO 9001 Kalite Yönetim Sistemi
- Kapasite: Aylık 1.000.000+ ürün üretim kapasitesi
- Müşteri: 1000+ B2B müşteri

**Ürün Kategorileri:**
1. PET Şişeler (50ml-1000ml arası, damla/silindir/kristal/boston/flat modeller)
2. Plastik Şişeler (HDPE, PP, LDPE hammaddeler)
3. Kapaklar (vidalı, flip-top, disc-top, pump, özel tasarım)
4. Tıpalar (iç tıpa, damlatıcı tıpa, sızdırmazlık)
5. Parmak Spreyler (18mm, 20mm, 24mm ağız çapları)
6. Pompalar (losyon, köpük, krem dozajlama)
7. Tetikli Püskürtücüler (temizlik ve bakım ürünleri için)
8. Huniler (dolum sürecinde kullanılan)

**Renkler:** Şeffaf, Amber, Füme, Beyaz, Mavi, Yeşil, Pembe ve özel renkler
**Malzemeler:** PET, HDPE, PP, LDPE
**Minimum Sipariş:** Ürüne göre 5.000-25.000 adet arası

**Kuralların:**
- Kısa, net ve yardımcı cevaplar ver (1-3 paragraf)
- Türkçe veya İngilizce yanıt ver (kullanıcının diline göre)
- Fiyat bilgisi verme, fiyat için teklif almalarını yönlendir
- Teknik detaylar için iletişim bilgilerini paylaş
- Kişisel veri toplama veya saklama yapma (KVKK uyumu)
- Her zaman profesyonel ve dostça ol
- Bilmediğin konularda "Bu konuda detaylı bilgi için müşteri temsilcimizle iletişime geçmenizi öneririm" de`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        reply:
          "AI asistan şu anda kullanılamıyor. Sorularınız için bize 0212 549 87 03 numarasından ulaşabilirsiniz.",
      },
      { status: 200 }
    );
  }

  try {
    const { messages, locale } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Mesaj gerekli" }, { status: 400 });
    }

    if (messages.length > 20) {
      messages.splice(0, messages.length - 20);
    }

    const openai = new OpenAI({ apiKey });

    const localeHint =
      locale === "en"
        ? "\n\nThe user is browsing in English. Reply in English."
        : "\n\nKullanıcı Türkçe sayfada. Türkçe yanıt ver.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + localeHint },
        ...messages.slice(-10).map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply:
          "Bir hata oluştu. Lütfen tekrar deneyin veya bize 0212 549 87 03 numarasından ulaşın.",
      },
      { status: 200 }
    );
  }
}
