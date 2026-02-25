"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Send, Phone, MessageCircle, Clock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";

const WHATSAPP_MAIN = "905307417599";
const WHATSAPP_OWNER = "905323936791";
const LANDLINE = "902125498703";

const TURKEY_TZ = "Europe/Istanbul";

interface Agent {
  id: string;
  nameKey: "sales" | "company" | "owner";
  phone: string;
  whatsapp: string | null;
  avatar: string;
}

const AGENTS: Agent[] = [
  {
    id: "sales",
    nameKey: "sales",
    phone: "0212 549 87 03",
    whatsapp: null,
    avatar: "S",
  },
  {
    id: "company",
    nameKey: "company",
    phone: "0530 741 75 99",
    whatsapp: WHATSAPP_MAIN,
    avatar: "K",
  },
  {
    id: "owner",
    nameKey: "owner",
    phone: "0532 393 67 91",
    whatsapp: WHATSAPP_OWNER,
    avatar: "Y",
  },
];

const t = {
  tr: {
    headerTitle: "Kısmet Plastik",
    headerSubOnline: "Çevrimiçi",
    headerSubOffline: "Çevrimdışı - En kısa sürede dönüş yapacağız",
    responseTime: "Genellikle 1 saat içinde yanıt verir",
    agentsTitle: "İletişim Kanalları",
    templateTitle: "Hızlı Mesaj Şablonları",
    templates: [
      "Ürün bilgisi almak istiyorum",
      "Teklif talebi göndermek istiyorum",
      "Sipariş durumunu öğrenmek istiyorum",
    ],
    inputPlaceholder: "Mesajınızı yazın...",
    send: "Gönder",
    agentNames: {
      sales: "Satış Ekibi",
      company: "Şirket WhatsApp",
      owner: "Yetkili",
    } as Record<string, string>,
    agentDesc: {
      sales: "Sabit Hat",
      company: "WhatsApp",
      owner: "WhatsApp",
    } as Record<string, string>,
    call: "Ara",
    chat: "Mesaj",
    startChat: "Sohbet Başlat",
    poweredBy: "WhatsApp Business ile desteklenmektedir",
  },
  en: {
    headerTitle: "Kısmet Plastik",
    headerSubOnline: "Online",
    headerSubOffline: "Offline - We will get back to you shortly",
    responseTime: "Typically replies within 1 hour",
    agentsTitle: "Contact Channels",
    templateTitle: "Quick Message Templates",
    templates: [
      "I would like to get product information",
      "I would like to send a quote request",
      "I would like to check my order status",
    ],
    inputPlaceholder: "Type your message...",
    send: "Send",
    agentNames: {
      sales: "Sales Team",
      company: "Company WhatsApp",
      owner: "Authorized Person",
    } as Record<string, string>,
    agentDesc: {
      sales: "Landline",
      company: "WhatsApp",
      owner: "WhatsApp",
    } as Record<string, string>,
    call: "Call",
    chat: "Message",
    startChat: "Start Chat",
    poweredBy: "Powered by WhatsApp Business",
  },
};

function isBusinessHours(): boolean {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: TURKEY_TZ })
  );
  const day = now.getDay();
  const hour = now.getHours();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

function openWhatsApp(number: string, message: string) {
  window.open(
    `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

const panelVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 30,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const staggerChildren = {
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const childFade = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function WhatsAppButton() {
  const { locale } = useLocale();
  const strings = t[locale] || t.tr;
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent>(AGENTS[1]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setOnline(isBusinessHours());
    const interval = setInterval(() => setOnline(isBusinessHours()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [open]);

  const handleTemplateClick = useCallback(
    (text: string) => {
      const agent = selectedAgent.whatsapp ? selectedAgent : AGENTS[1];
      openWhatsApp(agent.whatsapp!, text);
    },
    [selectedAgent]
  );

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed) return;
    const agent = selectedAgent.whatsapp ? selectedAgent : AGENTS[1];
    openWhatsApp(agent.whatsapp!, trimmed);
    setMessage("");
  }, [message, selectedAgent]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 max-sm:bottom-4 max-sm:right-4">
      <AnimatePresence>
        {open && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex w-[370px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/20 max-sm:fixed max-sm:inset-x-3 max-sm:bottom-20 max-sm:w-auto"
            style={{ maxHeight: "min(580px, calc(100dvh - 120px))" }}
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 bg-[#075E54] px-4 py-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                KP
                {online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#075E54] bg-[#25D366]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-semibold leading-tight text-white">
                  {strings.headerTitle}
                </h3>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${online ? "bg-[#25D366]" : "bg-neutral-400"}`}
                  />
                  <span className="truncate text-xs text-white/80">
                    {online
                      ? strings.headerSubOnline
                      : strings.headerSubOffline}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Response time */}
              <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-4 py-2.5">
                <Clock size={14} className="shrink-0 text-neutral-400" />
                <span className="text-xs text-neutral-500">
                  {strings.responseTime}
                </span>
              </div>

              {/* Agent cards */}
              <motion.div
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
                className="border-b border-neutral-100 px-4 py-3"
              >
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  {strings.agentsTitle}
                </p>
                <div className="space-y-2">
                  {AGENTS.map((agent) => {
                    const isActive = selectedAgent.id === agent.id;
                    return (
                      <motion.div
                        key={agent.id}
                        variants={childFade}
                        onClick={() => setSelectedAgent(agent)}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                          isActive
                            ? "border-[#25D366]/40 bg-[#25D366]/5 shadow-sm"
                            : "border-neutral-100 bg-white hover:border-neutral-200 hover:bg-neutral-50"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                            isActive ? "bg-[#075E54]" : "bg-neutral-300"
                          }`}
                        >
                          {agent.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-neutral-800">
                            {strings.agentNames[agent.nameKey]}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {strings.agentDesc[agent.nameKey]} &middot;{" "}
                            {agent.phone}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1.5">
                          {agent.whatsapp ? (
                            <a
                              href={`https://wa.me/${agent.whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-110"
                              aria-label={strings.chat}
                            >
                              <MessageCircle size={14} className="fill-current" />
                            </a>
                          ) : (
                            <a
                              href={`tel:+${LANDLINE}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#075E54] text-white transition-transform hover:scale-110"
                              aria-label={strings.call}
                            >
                              <Phone size={14} />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Quick message templates */}
              <motion.div
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
                className="px-4 py-3"
              >
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  {strings.templateTitle}
                </p>
                <div className="space-y-1.5">
                  {strings.templates.map((tmpl, i) => (
                    <motion.button
                      key={i}
                      variants={childFade}
                      onClick={() => handleTemplateClick(tmpl)}
                      className="group flex w-full items-center gap-2 rounded-xl border border-neutral-100 bg-white px-3.5 py-2.5 text-left text-sm text-neutral-700 transition-all hover:border-[#25D366]/30 hover:bg-[#25D366]/5 hover:text-neutral-900 active:scale-[0.98]"
                    >
                      <span className="flex-1">{tmpl}</span>
                      <Send
                        size={13}
                        className="shrink-0 text-neutral-300 transition-colors group-hover:text-[#25D366]"
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Input bar */}
            <div className="border-t border-neutral-100 bg-neutral-50 px-3 py-3">
              <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 focus-within:border-[#25D366]/50 focus-within:ring-2 focus-within:ring-[#25D366]/10">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={strings.inputPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition-all hover:bg-[#128C7E] disabled:opacity-40 disabled:hover:bg-[#25D366]"
                  aria-label={strings.send}
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-neutral-300">
                {strings.poweredBy}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
        onClick={() => setOpen((prev) => !prev)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 active:scale-95"
        aria-label="WhatsApp"
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
              <X size={26} />
            </motion.span>
          ) : (
            <motion.span
              key="wa"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={26} className="fill-current" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/30" />
        )}
      </motion.button>
    </div>
  );
}
