import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "@/lib/rate-limit";
import { getSystemPrompt } from "@/lib/chat-system-prompt";

const VALID_ROLES = new Set(["user", "assistant"]);
const VALID_LOCALES = new Set(["tr", "en"]);

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
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const { ok: allowed } = rateLimit(`chat:${ip}`, {
      limit: 20,
      windowMs: 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        {
          reply:
            "Çok fazla mesaj gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { messages, locale, stream: useStream } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Mesaj gerekli" }, { status: 400 });
    }

    const safeLocale = VALID_LOCALES.has(locale) ? locale : "tr";

    const validMessages = messages
      .filter(
        (m: unknown) =>
          typeof m === "object" &&
          m !== null &&
          typeof (m as Record<string, unknown>).role === "string" &&
          VALID_ROLES.has((m as Record<string, unknown>).role as string) &&
          typeof (m as Record<string, unknown>).content === "string" &&
          ((m as Record<string, unknown>).content as string).length <= 2000
      )
      .slice(-10);

    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: "Geçerli mesaj bulunamadı" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const systemPrompt = getSystemPrompt(safeLocale);

    const openaiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...validMessages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Streaming response
    if (useStream) {
      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: openaiMessages,
        max_tokens: 500,
        temperature: 0.7,
        stream: true,
      });

      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                );
              }
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (error) {
            console.error("Stream error:", error);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`
              )
            );
            controller.close();
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Non-streaming fallback response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
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
      { status: 500 }
    );
  }
}
