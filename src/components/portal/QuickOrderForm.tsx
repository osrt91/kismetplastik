"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Plus, X, FileSpreadsheet, ClipboardPaste, ShoppingCart, FileText } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/contexts/LocaleContext";
import type { Product } from "@/types/product";

/* -- Labels ----------------------------------------------------------- */

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Hizli Siparis",
    subtitle: "Urun kodu veya adini girerek hizlica siparis olusturun",
    productCode: "Urun Kodu",
    productName: "Urun Adi",
    quantity: "Miktar",
    unitPrice: "Birim Fiyat",
    total: "Toplam",
    addRow: "Satir Ekle",
    subtotal: "Ara Toplam",
    vat: "KDV (%20)",
    grandTotal: "Genel Toplam",
    createOrder: "Siparise Donustur",
    requestQuote: "Teklif Iste",
    excelPaste: "Excel'den Yapistir",
    excelModalTitle: "Excel Verisi Yapistir",
    excelModalDesc: "Her satira bir urun kodu ve miktar (Tab ile ayrilmis) yapistirin.",
    excelPlaceholder: "pet-001\t100\npls-001\t200\nkpk-002\t500",
    excelApply: "Uygula",
    excelCancel: "Iptal",
    productsAdded: "urun eklendi",
    productsNotFound: "urun kodu bulunamadi",
    noProducts: "Lutfen en az bir urun ekleyin",
    orderSuccess: "Siparis olusturuldu",
    quoteSuccess: "Teklif talebi gonderildi",
    removeRow: "Satiri kaldir",
    currency: "TL",
    minOrder: "Min. siparis",
    belowMinOrder: "Miktar minimum siparis adedinin altinda",
    submitting: "Gonderiliyor...",
  },
  en: {
    title: "Quick Order",
    subtitle: "Quickly create an order by entering product code or name",
    productCode: "Product Code",
    productName: "Product Name",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    total: "Total",
    addRow: "Add Row",
    subtotal: "Subtotal",
    vat: "VAT (20%)",
    grandTotal: "Grand Total",
    createOrder: "Create Order",
    requestQuote: "Request Quote",
    excelPaste: "Paste from Excel",
    excelModalTitle: "Paste Excel Data",
    excelModalDesc: "Paste one product code and quantity per line (Tab-separated).",
    excelPlaceholder: "pet-001\t100\npls-001\t200\nkpk-002\t500",
    excelApply: "Apply",
    excelCancel: "Cancel",
    productsAdded: "products added",
    productsNotFound: "product codes not found",
    noProducts: "Please add at least one product",
    orderSuccess: "Order created",
    quoteSuccess: "Quote request sent",
    removeRow: "Remove row",
    currency: "TL",
    minOrder: "Min. order",
    belowMinOrder: "Quantity is below minimum order",
    submitting: "Submitting...",
  },
};

/* -- Types ------------------------------------------------------------ */

interface OrderRow {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product: Product | null;
}

function createEmptyRow(): OrderRow {
  return {
    id: crypto.randomUUID(),
    productCode: "",
    productName: "",
    quantity: 0,
    unitPrice: 0,
    total: 0,
    product: null,
  };
}

/** Derive a mock unit price from the product (B2B placeholder). */
function getProductUnitPrice(product: Product): number {
  const weight = parseFloat(product.weight || "0");
  if (weight <= 0) return 0.5;
  if (weight < 5) return 0.25;
  if (weight < 15) return 0.75;
  if (weight < 30) return 1.5;
  return 2.5;
}

/* -- Component -------------------------------------------------------- */

export default function QuickOrderForm() {
  const { locale } = useLocale();
  const t = labels[locale] || labels.en || labels.tr;

  const [rows, setRows] = useState<OrderRow[]>([
    createEmptyRow(),
    createEmptyRow(),
    createEmptyRow(),
  ]);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelText, setExcelText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* -- Autocomplete state --------------------------------------------- */
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced API search for autocomplete
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 1) {
      setFilteredProducts([]);
      return;
    }

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
        const json = await res.json();
        if (json.success && json.data?.products) {
          setFilteredProducts(json.data.products);
        }
      } catch {
        // Silently fail
      }
    }, 200);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  /* -- Row helpers ----------------------------------------------------- */

  const updateRow = useCallback((rowId: string, updates: Partial<OrderRow>) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        const updated = { ...row, ...updates };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      })
    );
  }, []);

  const selectProduct = useCallback(
    (rowId: string, product: Product) => {
      const unitPrice = getProductUnitPrice(product);
      updateRow(rowId, {
        productCode: product.id,
        productName: product.name,
        unitPrice,
        product,
      });
      setActiveDropdown(null);
      setSearchQuery("");
    },
    [updateRow]
  );

  const handleCodeChange = useCallback(
    (rowId: string, value: string) => {
      updateRow(rowId, { productCode: value, productName: "", unitPrice: 0, product: null });

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        // Check for exact match via API
        try {
          const res = await fetch(`/api/products/search?q=${encodeURIComponent(value)}&limit=1`);
          const json = await res.json();
          const products = json.data?.products ?? [];
          const exactMatch = products.find(
            (p: Product) =>
              p.id.toLowerCase() === value.toLowerCase() ||
              p.slug.toLowerCase() === value.toLowerCase()
          );
          if (exactMatch) {
            selectProduct(rowId, exactMatch);
          } else {
            setSearchQuery(value);
            setActiveDropdown(rowId);
          }
        } catch {
          setSearchQuery(value);
          setActiveDropdown(rowId);
        }
      }, 200);
    },
    [updateRow, selectProduct]
  );

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, createEmptyRow()]);
  }, []);

  const removeRow = useCallback((rowId: string) => {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((r) => r.id !== rowId);
    });
  }, []);

  /* -- Totals --------------------------------------------------------- */

  const subtotal = rows.reduce((sum, row) => sum + row.total, 0);
  const vat = subtotal * 0.2;
  const grandTotal = subtotal + vat;

  const validRows = rows.filter((r) => r.product && r.quantity > 0);

  // Check if any valid row has quantity below product minOrder
  const rowsBelowMinOrder = validRows.filter(
    (r) => r.product && r.quantity < r.product.minOrder
  );

  /* -- Excel paste ---------------------------------------------------- */

  const handleExcelApply = useCallback(async () => {
    const lines = excelText
      .trim()
      .split("\n")
      .filter((l) => l.trim());

    let addedCount = 0;
    const notFoundCodes: string[] = [];
    const newRows: OrderRow[] = [];

    // Collect all codes and fetch them in batch
    const codes = lines
      .map((line) => {
        const parts = line.split("\t");
        return (parts[0] || "").trim();
      })
      .filter(Boolean);

    // Fetch products by search to resolve codes
    const productMap = new Map<string, Product>();
    for (const code of codes) {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(code)}&limit=1`);
        const json = await res.json();
        const products = json.data?.products ?? [];
        const match = products.find(
          (p: Product) =>
            p.id.toLowerCase() === code.toLowerCase() ||
            p.slug.toLowerCase() === code.toLowerCase()
        );
        if (match) productMap.set(code.toLowerCase(), match);
      } catch {
        // Skip
      }
    }

    for (const line of lines) {
      const parts = line.split("\t");
      const code = (parts[0] || "").trim();
      const qty = parseInt(parts[1] || "0", 10);

      if (!code) continue;

      const product = productMap.get(code.toLowerCase());

      if (product) {
        const unitPrice = getProductUnitPrice(product);
        newRows.push({
          id: crypto.randomUUID(),
          productCode: product.id,
          productName: product.name,
          quantity: qty > 0 ? qty : 1,
          unitPrice,
          total: (qty > 0 ? qty : 1) * unitPrice,
          product,
        });
        addedCount++;
      } else {
        notFoundCodes.push(code);
      }
    }

    if (addedCount > 0) {
      // Replace empty rows and append new ones
      setRows((prev) => {
        const nonEmpty = prev.filter((r) => r.product !== null);
        return [...nonEmpty, ...newRows];
      });
      toast.success(`${addedCount} ${t.productsAdded}`);
    }

    if (notFoundCodes.length > 0) {
      toast.error(`${notFoundCodes.length} ${t.productsNotFound}: ${notFoundCodes.join(", ")}`);
    }

    setShowExcelModal(false);
    setExcelText("");
  }, [excelText, t]);

  /* -- Submit handlers ------------------------------------------------ */

  const handleCreateOrder = useCallback(async () => {
    if (submitting) return;
    if (validRows.length === 0) {
      toast.error(t.noProducts);
      return;
    }
    if (rowsBelowMinOrder.length > 0) {
      toast.error(t.belowMinOrder);
      return;
    }
    setSubmitting(true);
    try {
      // In a real app, this would call an API
      toast.success(t.orderSuccess);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, validRows, rowsBelowMinOrder, t]);

  const handleRequestQuote = useCallback(async () => {
    if (submitting) return;
    if (validRows.length === 0) {
      toast.error(t.noProducts);
      return;
    }
    if (rowsBelowMinOrder.length > 0) {
      toast.error(t.belowMinOrder);
      return;
    }
    setSubmitting(true);
    try {
      // In a real app, this would call an API
      toast.success(t.quoteSuccess);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, validRows, rowsBelowMinOrder, t]);

  /* -- Format helpers ------------------------------------------------- */

  const formatPrice = (value: number) =>
    value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A1628] dark:text-white lg:text-3xl">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowExcelModal(true)}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#0A1628] bg-transparent px-4 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#0A1628] hover:text-white dark:border-neutral-500 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          <FileSpreadsheet size={16} />
          {t.excelPaste}
        </button>
      </div>

      {/* Order table card */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">
                <th className="px-4 py-3 w-[200px]">{t.productCode}</th>
                <th className="px-4 py-3">{t.productName}</th>
                <th className="px-4 py-3 w-[120px]">{t.quantity}</th>
                <th className="px-4 py-3 w-[130px] text-right">{t.unitPrice}</th>
                <th className="px-4 py-3 w-[130px] text-right">{t.total}</th>
                <th className="px-4 py-3 w-[50px]" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {rows.map((row) => (
                <tr key={row.id} className="group">
                  {/* Product Code */}
                  <td className="px-4 py-2 relative">
                    <input
                      type="text"
                      value={row.productCode}
                      onChange={(e) => handleCodeChange(row.id, e.target.value)}
                      onFocus={() => {
                        if (row.productCode && !row.product) {
                          setSearchQuery(row.productCode);
                          setActiveDropdown(row.id);
                        }
                      }}
                      placeholder="pet-001"
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-[#0A1628] placeholder:text-neutral-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    {/* Autocomplete dropdown */}
                    {activeDropdown === row.id && filteredProducts.length > 0 && (
                      <div
                        ref={dropdownRef}
                        className="absolute left-4 right-4 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg"
                      >
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => selectProduct(row.id, product)}
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-amber-50"
                          >
                            <span className="font-mono text-xs text-neutral-400">{product.id}</span>
                            <span className="text-[#0A1628]">{product.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  {/* Product Name */}
                  <td className="px-4 py-2">
                    <span className={`text-sm ${row.productName ? "text-[#0A1628]" : "text-neutral-300"}`}>
                      {row.productName || "-"}
                    </span>
                    {row.product && (
                      <span className="ml-2 text-xs text-neutral-400">
                        {t.minOrder}: {row.product.minOrder.toLocaleString()}
                      </span>
                    )}
                  </td>
                  {/* Quantity */}
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={1}
                      value={row.quantity || ""}
                      onChange={(e) =>
                        updateRow(row.id, { quantity: parseInt(e.target.value, 10) || 0 })
                      }
                      placeholder="0"
                      className={`w-full rounded-lg border px-3 py-2 font-mono text-sm text-[#0A1628] placeholder:text-neutral-300 focus:outline-none focus:ring-1 ${
                        row.product && row.quantity > 0 && row.quantity < row.product.minOrder
                          ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                          : "border-neutral-200 focus:border-amber-400 focus:ring-amber-400"
                      }`}
                    />
                    {row.product && row.quantity > 0 && row.quantity < row.product.minOrder && (
                      <p className="mt-0.5 text-[10px] text-red-500">
                        {t.minOrder}: {row.product.minOrder.toLocaleString()}
                      </p>
                    )}
                  </td>
                  {/* Unit Price */}
                  <td className="px-4 py-2 text-right">
                    <span className="font-mono text-sm text-[#0A1628]">
                      {row.unitPrice > 0 ? `${formatPrice(row.unitPrice)} ${t.currency}` : "-"}
                    </span>
                  </td>
                  {/* Row Total */}
                  <td className="px-4 py-2 text-right">
                    <span className="font-mono text-sm font-medium text-[#0A1628]">
                      {row.total > 0 ? `${formatPrice(row.total)} ${t.currency}` : "-"}
                    </span>
                  </td>
                  {/* Remove */}
                  <td className="px-4 py-2">
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="rounded-lg p-1.5 text-neutral-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                        title={t.removeRow}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-4 p-4 lg:hidden">
          {rows.map((row, idx) => (
            <div key={row.id} className="rounded-lg border border-neutral-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  #{idx + 1}
                </span>
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500"
                    title={t.removeRow}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="relative">
                <label className="text-xs font-medium text-neutral-500">{t.productCode}</label>
                <input
                  type="text"
                  value={row.productCode}
                  onChange={(e) => handleCodeChange(row.id, e.target.value)}
                  onFocus={() => {
                    if (row.productCode && !row.product) {
                      setSearchQuery(row.productCode);
                      setActiveDropdown(row.id);
                    }
                  }}
                  placeholder="pet-001"
                  className="mt-1 h-11 w-full rounded-lg border border-neutral-200 px-3 text-sm text-[#0A1628] placeholder:text-neutral-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                {activeDropdown === row.id && filteredProducts.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg"
                  >
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => selectProduct(row.id, product)}
                        className="flex min-h-[44px] w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-amber-50"
                      >
                        <span className="font-mono text-xs text-neutral-400">{product.id}</span>
                        <span className="text-[#0A1628]">{product.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {row.productName && (
                <div>
                  <label className="text-xs font-medium text-neutral-500">{t.productName}</label>
                  <p className="mt-0.5 text-sm text-[#0A1628]">{row.productName}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-500">{t.quantity}</label>
                  <input
                    type="number"
                    min={1}
                    value={row.quantity || ""}
                    onChange={(e) =>
                      updateRow(row.id, { quantity: parseInt(e.target.value, 10) || 0 })
                    }
                    placeholder="0"
                    className={`mt-1 h-11 w-full rounded-lg border px-3 font-mono text-sm text-[#0A1628] placeholder:text-neutral-300 focus:outline-none focus:ring-1 ${
                      row.product && row.quantity > 0 && row.quantity < row.product.minOrder
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                        : "border-neutral-200 focus:border-amber-400 focus:ring-amber-400"
                    }`}
                  />
                  {row.product && row.quantity > 0 && row.quantity < row.product.minOrder && (
                    <p className="mt-0.5 text-[10px] text-red-500">
                      Min: {row.product.minOrder.toLocaleString()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-500">{t.unitPrice}</label>
                  <p className="mt-1 font-mono text-sm text-[#0A1628]">
                    {row.unitPrice > 0 ? `${formatPrice(row.unitPrice)} ${t.currency}` : "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-500">{t.total}</label>
                  <p className="mt-1 font-mono text-sm font-medium text-[#0A1628]">
                    {row.total > 0 ? `${formatPrice(row.total)} ${t.currency}` : "-"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add row button */}
        <div className="border-t border-neutral-100 px-4 py-3">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-50"
          >
            <Plus size={16} />
            {t.addRow}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-col sm:items-end">
        <div className="w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:w-[360px] dark:border-neutral-700 dark:bg-neutral-800">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">{t.subtotal}</span>
              <span className="font-mono text-[#0A1628]">
                {formatPrice(subtotal)} {t.currency}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">{t.vat}</span>
              <span className="font-mono text-[#0A1628]">
                {formatPrice(vat)} {t.currency}
              </span>
            </div>
            <div className="border-t border-neutral-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0A1628]">{t.grandTotal}</span>
                <span className="font-mono text-lg font-bold text-[#0A1628]">
                  {formatPrice(grandTotal)} {t.currency}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCreateOrder}
              disabled={submitting}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-semibold text-[#0A1628] shadow-sm transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart size={16} />
              {submitting ? t.submitting : t.createOrder}
            </button>
            <button
              type="button"
              onClick={handleRequestQuote}
              disabled={submitting}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#0A1628] bg-transparent px-5 text-sm font-semibold text-[#0A1628] transition-all hover:bg-[#0A1628] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileText size={16} />
              {submitting ? t.submitting : t.requestQuote}
            </button>
          </div>
        </div>
      </div>

      {/* Excel paste modal */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full max-h-[90dvh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <ClipboardPaste size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#0A1628]">
                  {t.excelModalTitle}
                </h3>
                <p className="text-sm text-neutral-500">{t.excelModalDesc}</p>
              </div>
            </div>

            <textarea
              value={excelText}
              onChange={(e) => setExcelText(e.target.value)}
              placeholder={t.excelPlaceholder}
              rows={8}
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 font-mono text-sm text-[#0A1628] placeholder:text-neutral-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              autoFocus
            />

            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowExcelModal(false);
                  setExcelText("");
                }}
                className="h-11 rounded-xl border border-neutral-200 px-5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
              >
                {t.excelCancel}
              </button>
              <button
                type="button"
                onClick={handleExcelApply}
                disabled={!excelText.trim()}
                className="h-11 rounded-xl bg-amber-500 px-5 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t.excelApply}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
