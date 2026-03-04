"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  MailOpen,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Send,
  X,
  RefreshCw,
  MessageSquare,
  Clock,
  User,
  Building2,
  Phone,
  Reply,
} from "lucide-react";
import type { DbContactMessage, ContactMessageStatus } from "@/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

type StatusFilter = "all" | ContactMessageStatus;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: ContactMessageStatus }) {
  const map: Record<ContactMessageStatus, { label: string; cls: string }> = {
    unread: { label: "Okunmadı", cls: "bg-blue-500/15 text-blue-600" },
    read: { label: "Okundu", cls: "bg-muted text-muted-foreground" },
    replied: { label: "Yanıtlandı", cls: "bg-success/15 text-success" },
  };
  const { label, cls } = map[status] ?? map.read;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function MessageModal({
  message,
  onClose,
  onStatusChange,
  onDelete,
}: {
  message: DbContactMessage;
  onClose: () => void;
  onStatusChange: (id: string, status: ContactMessageStatus) => void;
  onDelete: (id: string) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    setSendError("");
    setSendSuccess(false);

    try {
      const res = await fetch(`/api/admin/messages/${currentMessage.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText }),
      });
      const json = await res.json();
      if (!json.success) {
        setSendError(json.error ?? "Yanıt gönderilemedi");
      } else {
        setSendSuccess(true);
        setReplyText("");
        const updated: DbContactMessage = { ...currentMessage, status: "replied", reply_message: replyText, replied_at: new Date().toISOString() };
        setCurrentMessage(updated);
        onStatusChange(currentMessage.id, "replied");
      }
    } catch {
      setSendError("Bağlantı hatası");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return;
    try {
      await fetch(`/api/admin/messages/${currentMessage.id}`, { method: "DELETE" });
      onDelete(currentMessage.id);
      onClose();
    } catch {
      // silently ignore
    }
  };

  const handleMarkUnread = async () => {
    try {
      await fetch(`/api/admin/messages/${currentMessage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "unread" }),
      });
      setCurrentMessage({ ...currentMessage, status: "unread" });
      onStatusChange(currentMessage.id, "unread");
    } catch {
      // silently ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={currentMessage.status} />
              <span className="text-xs text-muted-foreground">
                {formatDate(currentMessage.created_at)}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {currentMessage.subject}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sender info */}
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User size={14} className="shrink-0" />
              <span className="font-medium text-foreground">{currentMessage.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={14} className="shrink-0" />
              <a
                href={`mailto:${currentMessage.email}`}
                className="text-primary hover:underline"
              >
                {currentMessage.email}
              </a>
            </div>
            {currentMessage.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} className="shrink-0" />
                <span>{currentMessage.phone}</span>
              </div>
            )}
            {currentMessage.company && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 size={14} className="shrink-0" />
                <span>{currentMessage.company}</span>
              </div>
            )}
          </div>
        </div>

        {/* Message body */}
        <div className="px-6 py-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {currentMessage.message}
          </p>
        </div>

        {/* Previous reply */}
        {currentMessage.reply_message && (
          <div className="mx-6 mb-5 rounded-xl border border-success/20 bg-success/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-success">
              <Reply size={13} />
              Gönderilen Yanıt
              {currentMessage.replied_at && (
                <span className="font-normal text-muted-foreground">
                  — {formatDate(currentMessage.replied_at)}
                </span>
              )}
            </div>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {currentMessage.reply_message}
            </p>
          </div>
        )}

        {/* Reply form */}
        <div className="border-t border-border px-6 py-5">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Yanıt Gönder
          </label>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={4}
            placeholder="Yanıtınızı buraya yazın..."
            className="w-full resize-y rounded-lg border border-border bg-background p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {sendError && (
            <p className="mt-1.5 text-xs text-destructive">{sendError}</p>
          )}
          {sendSuccess && (
            <p className="mt-1.5 text-xs text-success">Yanıt başarıyla gönderildi.</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={handleReply}
              disabled={sending || !replyText.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              Yanıt Gönder
            </button>
            {currentMessage.status !== "unread" && (
              <button
                onClick={handleMarkUnread}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                <Mail size={14} />
                Okunmadı İşaretle
              </button>
            )}
            <button
              onClick={handleDelete}
              className="ml-auto inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-destructive/70 transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 size={14} />
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<DbContactMessage[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 15,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeMessage, setActiveMessage] = useState<DbContactMessage | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // ─── Fetch ──────────────────────────────────────────────────────────────────

  const fetchMessages = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page) });
        if (search) params.set("search", search);
        if (statusFilter !== "all") params.set("status", statusFilter);

        const res = await fetch(`/api/admin/messages?${params}`);
        const json = await res.json();

        if (json.success) {
          setMessages(json.data.messages ?? []);
          setPagination(json.pagination);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter]
  );

  useEffect(() => {
    fetchMessages(1);
    setSelected(new Set());
  }, [fetchMessages]);

  // ─── Selection ──────────────────────────────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === messages.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(messages.map((m) => m.id)));
    }
  };

  // ─── Bulk Delete ────────────────────────────────────────────────────────────

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`${selected.size} mesajı silmek istediğinizden emin misiniz?`)) return;

    setBulkDeleting(true);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      const json = await res.json();
      if (json.success) {
        setSelected(new Set());
        fetchMessages(pagination.page);
      }
    } catch {
      // ignore
    } finally {
      setBulkDeleting(false);
    }
  };

  // ─── Row click (open message + mark read) ───────────────────────────────────

  const handleRowClick = async (msg: DbContactMessage) => {
    // Optimistically update status in list
    if (msg.status === "unread") {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m))
      );
    }
    // Fetch full message (also triggers auto mark-read server side)
    try {
      const res = await fetch(`/api/admin/messages/${msg.id}`);
      const json = await res.json();
      if (json.success) {
        setActiveMessage(json.data);
      } else {
        setActiveMessage(msg);
      }
    } catch {
      setActiveMessage(msg);
    }
  };

  // ─── Callbacks for modal ─────────────────────────────────────────────────────

  const handleStatusChange = (id: string, status: ContactMessageStatus) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const handleDeleteFromModal = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
  };

  // ─── Status filter tabs ──────────────────────────────────────────────────────

  const filterTabs: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Tümü" },
    { value: "unread", label: "Okunmadı" },
    { value: "read", label: "Okundu" },
    { value: "replied", label: "Yanıtlandı" },
  ];

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {activeMessage && (
        <MessageModal
          message={activeMessage}
          onClose={() => setActiveMessage(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteFromModal}
        />
      )}

      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <MessageSquare size={24} className="text-primary" />
              İletişim Mesajları
              {unreadCount > 0 && (
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Toplam {pagination.total} mesaj
            </p>
          </div>
          <button
            onClick={() => fetchMessages(pagination.page)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <RefreshCw size={14} />
            Yenile
          </button>
        </div>

        {/* Filters row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Status tabs */}
          <div className="flex overflow-x-auto rounded-lg border border-border bg-card p-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  statusFilter === tab.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ad, e-posta veya konu ara..."
              className="w-full rounded-lg border border-border bg-card py-2 pl-8 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Bulk delete */}
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="inline-flex items-center gap-2 rounded-lg bg-destructive px-3 py-2 text-sm font-semibold text-destructive-foreground shadow-sm transition-all hover:bg-destructive/90 disabled:opacity-60"
            >
              {bulkDeleting ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              {selected.size} Mesajı Sil
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <RefreshCw size={20} className="animate-spin" />
              <span className="ml-2 text-sm">Yükleniyor...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Mail size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">Mesaj bulunamadı</p>
              <p className="mt-1 text-xs opacity-60">
                {statusFilter !== "all" || search
                  ? "Filtre veya arama kriterlerinizi değiştirmeyi deneyin"
                  : "Henüz iletişim mesajı yok"}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="w-10 px-4 py-3">
                    <button
                      onClick={toggleSelectAll}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {selected.size === messages.length && messages.length > 0 ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Gönderen
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground sm:table-cell">
                    Konu
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground md:table-cell">
                    Durum
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground lg:table-cell">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => {
                  const isUnread = msg.status === "unread";
                  const isSelected = selected.has(msg.id);

                  return (
                    <tr
                      key={msg.id}
                      className={`group border-b border-border last:border-0 transition-colors ${
                        isSelected ? "bg-primary/5" : isUnread ? "bg-blue-500/5" : "hover:bg-muted/40"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(msg.id);
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="text-primary" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>

                      {/* Sender — clickable row trigger */}
                      <td
                        className="cursor-pointer px-4 py-3.5"
                        onClick={() => handleRowClick(msg)}
                      >
                        <div className="flex items-center gap-2">
                          {isUnread ? (
                            <Mail size={14} className="shrink-0 text-blue-500" />
                          ) : (
                            <MailOpen size={14} className="shrink-0 text-muted-foreground" />
                          )}
                          <div>
                            <p
                              className={`leading-tight ${
                                isUnread
                                  ? "font-semibold text-foreground"
                                  : "font-medium text-foreground"
                              }`}
                            >
                              {msg.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{msg.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Subject */}
                      <td
                        className="hidden cursor-pointer px-4 py-3.5 sm:table-cell"
                        onClick={() => handleRowClick(msg)}
                      >
                        <p
                          className={`max-w-xs truncate ${
                            isUnread ? "font-semibold text-foreground" : "text-foreground"
                          }`}
                        >
                          {msg.subject}
                        </p>
                        {msg.company && (
                          <p className="text-xs text-muted-foreground">{msg.company}</p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="hidden px-4 py-3.5 md:table-cell">
                        <StatusBadge status={msg.status} />
                      </td>

                      {/* Date */}
                      <td className="hidden px-4 py-3.5 text-xs text-muted-foreground lg:table-cell">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(msg.created_at)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Sayfa {pagination.page} / {pagination.totalPages} — Toplam {pagination.total} mesaj
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchMessages(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} />
                Önceki
              </button>
              <button
                onClick={() => fetchMessages(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sonraki
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
