"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type RefObject,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Trash2,
  Clock,
  Phone,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

/* ------------------------------------------------------------------ */
/*  i18n strings                                                       */
/* ------------------------------------------------------------------ */

const t = {
  tr: {
    title: "AI Asistan",
    subtitle: "Kozmetik ambalaj hakkında sorularınızı yanıtlıyorum",
    placeholder: "Mesajınızı yazın...",
    greeting:
      "Merhaba! Ben Kısmet Plastik'in AI asistanıyım. Kozmetik ambalaj, ürünlerimiz ve hizmetlerimiz hakkında sorularınızı yanıtlayabilirim. Size nasıl yardımcı olabilirim?",
    suggestions: [
      "Hangi ürünleri üretiyorsunuz?",
      "Minimum sipariş miktarı nedir?",
      "PET şişe boyutları neler?",
    ],
    clearChat: "Sohbeti Temizle",
    kvkk: "Kişisel veri saklanmaz",
    outsideHours: "Mesai dışında",
    outsideHoursDetail:
      "Şu an mesai saatleri dışındayız (Pzt-Cum 09:00-18:00). AI asistan hizmetinizde, acil konular için canlı desteğe aktarabilirsiniz.",
    liveSupport: "Canlı Desteğe Aktar",
    typing: "Yazıyor",
    errorGeneric: "Bir hata oluştu. Lütfen tekrar deneyin.",
    errorRateLimit:
      "Çok fazla mesaj gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.",
    errorNetwork:
      "Bağlantı hatası. İnternet bağlantınızı kontrol edip tekrar deneyin.",
    today: "Bugün",
  },
  en: {
    title: "AI Assistant",
    subtitle: "Answering your questions about cosmetic packaging",
    placeholder: "Type your message...",
    greeting:
      "Hello! I'm Kısmet Plastik's AI assistant. I can answer your questions about cosmetic packaging, our products, and services. How can I help you?",
    suggestions: [
      "What products do you manufacture?",
      "What is the minimum order quantity?",
      "What PET bottle sizes are available?",
    ],
    clearChat: "Clear Chat",
    kvkk: "No personal data stored",
    outsideHours: "Outside business hours",
    outsideHoursDetail:
      "We are currently outside business hours (Mon-Fri 09:00-18:00 Turkey time). AI assistant is at your service; you can transfer to live support for urgent matters.",
    liveSupport: "Transfer to Live Support",
    typing: "Typing",
    errorGeneric: "An error occurred. Please try again.",
    errorRateLimit: "Too many messages. Please wait and try again.",
    errorNetwork: "Connection error. Please check your internet and try again.",
    today: "Today",
  },
};

/* ------------------------------------------------------------------ */
/*  WhatsApp live support link                                         */
/* ------------------------------------------------------------------ */

const WHATSAPP_NUMBER = "905307417599";
const WHATSAPP_URL_TR = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Merhaba, web sitenizdeki AI asistandan yönlendirildim. Yardımınıza ihtiyacım var.")}`;
const WHATSAPP_URL_EN = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello, I was directed from your website's AI assistant. I need your help.")}`;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Check if current time is within business hours (Mon-Fri 09:00-18:00 Turkey) */
function isWithinBusinessHours(): boolean {
  const now = new Date();
  // Turkey is UTC+3
  const turkeyOffset = 3 * 60; // minutes
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const turkeyMinutes = utcMinutes + turkeyOffset;
  const turkeyHour = Math.floor(((turkeyMinutes % 1440) + 1440) % 1440 / 60);

  // Get Turkey day of week
  const turkeyTotalMs =
    now.getTime() + turkeyOffset * 60 * 1000;
  const turkeyDate = new Date(turkeyTotalMs);
  const dayOfWeek = turkeyDate.getUTCDay(); // 0=Sun, 6=Sat

  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isWorkingHour = turkeyHour >= 9 && turkeyHour < 18;

  return isWeekday && isWorkingHour;
}

/** Format timestamp for display */
function formatTime(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  Typing indicator (three bouncing dots)                             */
/* ------------------------------------------------------------------ */

function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-2.5 rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-3">
        <div className="flex items-center gap-1">
          <span
            className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
            style={{ animationDelay: "300ms" }}
          />
        </div>
        <span className="text-xs text-neutral-400">{label}...</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function AIChatbot() {
  const { locale } = useLocale();
  const strings = t[locale] || t.tr;
  const whatsappUrl = locale === "en" ? WHATSAPP_URL_EN : WHATSAPP_URL_TR;

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: strings.greeting,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [isBusinessHours, setIsBusinessHours] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef: RefObject<Message[]> = useRef(messages);
  const abortControllerRef = useRef<AbortController | null>(null);
  messagesRef.current = messages;

  // Check business hours on mount and every minute
  useEffect(() => {
    setIsBusinessHours(isWithinBusinessHours());
    const interval = setInterval(() => {
      setIsBusinessHours(isWithinBusinessHours());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Delay visibility for the floating button
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll on new messages or streaming content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  // Focus input on open
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Reset greeting when locale changes
  const prevLocaleRef = useRef(locale);
  useEffect(() => {
    if (prevLocaleRef.current !== locale) {
      prevLocaleRef.current = locale;
      const newStrings = t[locale] || t.tr;
      setMessages([
        {
          role: "assistant",
          content: newStrings.greeting,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [locale]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = {
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };
      const newMessages = [...messagesRef.current, userMsg];
      setMessages(newMessages);
      setInput("");
      setLoading(true);
      setStreamingContent("");

      // Prepare messages for API (strip timestamps)
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Abort any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            locale,
            stream: true,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const errorContent =
            res.status === 429
              ? strings.errorRateLimit
              : data?.reply || strings.errorGeneric;
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: errorContent,
              timestamp: Date.now(),
            },
          ]);
          setLoading(false);
          return;
        }

        const contentType = res.headers.get("content-type") || "";

        // Handle streaming response (text/event-stream)
        if (contentType.includes("text/event-stream") && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let accumulated = "";
          let buffer = "";

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              // Keep the last potentially incomplete line in buffer
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine || !trimmedLine.startsWith("data: "))
                  continue;

                const data = trimmedLine.slice(6);
                if (data === "[DONE]") break;

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    accumulated += parsed.content;
                    setStreamingContent(accumulated);
                  }
                  if (parsed.error) {
                    console.error("Stream server error:", parsed.error);
                  }
                } catch {
                  // Skip malformed JSON chunks
                }
              }
            }
          } catch (err) {
            if ((err as Error).name !== "AbortError") {
              console.error("Stream read error:", err);
            }
          }

          // Finalize: move streaming content to messages
          if (accumulated) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: accumulated,
                timestamp: Date.now(),
              },
            ]);
          } else {
            // No content came through the stream
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: strings.errorGeneric,
                timestamp: Date.now(),
              },
            ]);
          }
          setStreamingContent("");
        } else {
          // Handle non-streaming JSON response (fallback)
          const data = await res.json();
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.reply || strings.errorGeneric,
              timestamp: Date.now(),
            },
          ]);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: strings.errorNetwork,
              timestamp: Date.now(),
            },
          ]);
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [loading, locale, strings]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setStreamingContent("");
    setMessages([
      {
        role: "assistant",
        content: strings.greeting,
        timestamp: Date.now(),
      },
    ]);
  };

  // Memoize the business hours banner so it does not re-render on every keystroke
  const businessHoursBanner = useMemo(() => {
    if (isBusinessHours) return null;
    return (
      <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2.5">
        <Clock size={14} className="mt-0.5 shrink-0 text-amber-600" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-amber-800">
            {strings.outsideHours}
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-amber-600">
            {strings.outsideHoursDetail}
          </p>
        </div>
      </div>
    );
  }, [isBusinessHours, strings]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-3 max-sm:bottom-4 max-sm:left-4">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="flex w-[380px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/15 dark:bg-neutral-900 max-sm:fixed max-sm:inset-x-3 max-sm:bottom-20 max-sm:w-auto"
            style={{ maxHeight: "min(600px, calc(100dvh - 120px))" }}
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Bot size={20} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white">
                  {strings.title}
                </h3>
                <p className="truncate text-xs text-white/70">
                  {strings.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                  title={strings.clearChat}
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Business hours notice */}
            {businessHoursBanner}

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4"
              style={{ minHeight: 200 }}
              aria-live="polite"
            >
              {messages.map((msg, i) => (
                <div
                  key={`${msg.timestamp}-${i}`}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="mt-1 text-[10px] text-neutral-300 dark:text-neutral-600">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              ))}

              {/* Streaming content (assistant is still generating) */}
              {loading && streamingContent && (
                <div className="flex flex-col items-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-neutral-100 px-3.5 py-2.5 text-sm leading-relaxed text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                    {streamingContent}
                    <span className="ml-1 inline-block h-3 w-0.5 animate-pulse bg-primary/60" />
                  </div>
                </div>
              )}

              {/* Typing indicator (before any stream content arrives) */}
              {loading && !streamingContent && (
                <TypingIndicator label={strings.typing} />
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 border-t border-neutral-100 px-4 py-2.5 dark:border-neutral-800">
                {strings.suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/10 active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Live support transfer button */}
            <div className="border-t border-neutral-100 px-4 py-2 dark:border-neutral-800">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-600 active:scale-[0.98]"
              >
                <Phone size={14} />
                {strings.liveSupport}
              </a>
            </div>

            {/* Input */}
            <div className="border-t border-neutral-100 bg-neutral-50 px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-neutral-700 dark:bg-neutral-800">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={strings.placeholder}
                  disabled={loading}
                  className="min-w-0 flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400 disabled:opacity-50 dark:text-neutral-200"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-neutral-300 dark:text-neutral-600">
                {strings.kvkk}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
          delay: 0.3,
        }}
        onClick={() => setOpen((prev) => !prev)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/40 active:scale-95"
        aria-label="AI Chatbot"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles size={24} />
            </motion.span>
          )}
        </AnimatePresence>

        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        )}
      </motion.button>
    </div>
  );
}
