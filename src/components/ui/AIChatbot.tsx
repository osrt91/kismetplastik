"use client";

import { useState, useRef, useEffect, useCallback, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Loader2,
  Trash2,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

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
  },
};

export default function AIChatbot() {
  const { locale } = useLocale();
  const strings = t[locale] || t.tr;

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: strings.greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef: RefObject<Message[]> = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = { role: "user", content: trimmed };
      const newMessages = [...messagesRef.current, userMsg];
      setMessages(newMessages);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages, locale }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              locale === "tr"
                ? "Bir hata oluştu. Lütfen tekrar deneyin."
                : "An error occurred. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, locale]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: strings.greeting }]);
  };

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
            className="flex w-[380px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/15 max-sm:fixed max-sm:inset-x-3 max-sm:bottom-20 max-sm:w-auto"
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

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4"
              style={{ minHeight: 200 }}
              aria-live="polite"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-neutral-100 text-neutral-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-3">
                    <Loader2
                      size={14}
                      className="animate-spin text-primary"
                    />
                    <span className="text-xs text-neutral-400">
                      {locale === "tr" ? "Yazıyor..." : "Typing..."}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 border-t border-neutral-100 px-4 py-2.5">
                {strings.suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/10 active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-neutral-100 bg-neutral-50 px-3 py-3">
              <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={strings.placeholder}
                  disabled={loading}
                  className="min-w-0 flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400 disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-neutral-300">
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
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
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
