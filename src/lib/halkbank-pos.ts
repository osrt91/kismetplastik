/**
 * Halkbank Sanal POS — 3D Secure Integration
 *
 * Requires environment variables:
 *   HALKBANK_MERCHANT_ID
 *   HALKBANK_TERMINAL_ID
 *   HALKBANK_STORE_KEY
 *   HALKBANK_3D_URL (3D Secure gateway URL)
 *   NEXT_PUBLIC_BASE_URL (for callback URLs)
 */

import { createHash } from "crypto";

export interface PaymentRequest {
  orderId: string;
  amount: number; // TRY, in lira (e.g., 1250.50)
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string; // "01"-"12"
  expireYear: string; // "26"
  cvv: string;
  installment?: number; // 1 = tek cekim
}

export interface PaymentInitResult {
  success: boolean;
  htmlForm?: string; // 3D Secure redirect HTML form
  error?: string;
}

export interface PaymentCallbackResult {
  success: boolean;
  orderId: string;
  transactionId?: string;
  amount?: number;
  error?: string;
  rawResponse?: Record<string, string>;
}

function getConfig() {
  const merchantId = process.env.HALKBANK_MERCHANT_ID;
  const terminalId = process.env.HALKBANK_TERMINAL_ID;
  const storeKey = process.env.HALKBANK_STORE_KEY;
  const gatewayUrl = process.env.HALKBANK_3D_URL;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.kismetplastik.com";

  if (!merchantId || !terminalId || !storeKey || !gatewayUrl) {
    throw new Error("Halkbank POS yapilandirmasi eksik. Env degiskenlerini kontrol edin.");
  }

  return { merchantId, terminalId, storeKey, gatewayUrl, baseUrl };
}

function generateHash(params: string[], storeKey: string): string {
  const hashStr = params.join("") + storeKey;
  return createHash("sha512").update(hashStr).digest("base64");
}

/**
 * Initiate 3D Secure payment — returns HTML form to POST to bank gateway
 */
export async function initiatePayment(req: PaymentRequest): Promise<PaymentInitResult> {
  try {
    const config = getConfig();

    const amountStr = req.amount.toFixed(2);
    const installment = String(req.installment ?? 1);
    const okUrl = `${config.baseUrl}/api/payment/callback`;
    const failUrl = `${config.baseUrl}/api/payment/callback`;
    const rnd = Date.now().toString();

    // Hash: merchantId + orderId + amount + okUrl + failUrl + transactionType + installment + rnd + storeKey
    const hashData = [
      config.merchantId,
      req.orderId,
      amountStr,
      okUrl,
      failUrl,
      "Auth", // transaction type
      installment,
      rnd,
    ];
    const hash = generateHash(hashData, config.storeKey);

    // Build auto-submit HTML form for 3D Secure redirect
    const formFields: Record<string, string> = {
      clientid: config.merchantId,
      storetype: "3d_pay",
      islemtipi: "Auth",
      amount: amountStr,
      currency: "949", // TRY
      oid: req.orderId,
      okUrl,
      failUrl,
      lang: "tr",
      rnd,
      hash,
      pan: req.cardNumber.replace(/\s/g, ""),
      Ecom_Payment_Card_ExpDate_Month: req.expireMonth,
      Ecom_Payment_Card_ExpDate_Year: req.expireYear,
      cv2: req.cvv,
      cardHolderName: req.cardHolderName,
      taksit: installment,
    };

    const hiddenInputs = Object.entries(formFields)
      .map(
        ([name, value]) =>
          `<input type="hidden" name="${name}" value="${escapeHtml(value)}" />`
      )
      .join("\n");

    const htmlForm = `
      <!DOCTYPE html>
      <html>
      <head><title>Odeme Yonlendiriliyor...</title></head>
      <body onload="document.getElementById('payform').submit();">
        <div style="text-align:center;padding:50px;font-family:sans-serif;">
          <p>Banka sayfasina yonlendiriliyorsunuz...</p>
          <p style="color:#888;">Lutfen bekleyiniz.</p>
        </div>
        <form id="payform" method="POST" action="${config.gatewayUrl}">
          ${hiddenInputs}
        </form>
      </body>
      </html>
    `;

    return { success: true, htmlForm };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Odeme baslatilamadi";
    return { success: false, error: message };
  }
}

/**
 * Verify 3D Secure callback from bank
 */
export function verifyCallback(
  formData: Record<string, string>
): PaymentCallbackResult {
  try {
    const config = getConfig();

    const mdStatus = formData.mdStatus ?? formData.MdStatus ?? "";
    const orderId = formData.oid ?? formData.ReturnOid ?? "";
    const transactionId = formData.TransId ?? "";
    const procReturnCode = formData.ProcReturnCode ?? "";
    const response = formData.Response ?? "";
    const amount = parseFloat(formData.amount ?? "0");

    // Verify hash
    const hashParams = formData.HASHPARAMS ?? "";
    const hashParamsVal = formData.HASHPARAMSVAL ?? "";
    const bankHash = formData.HASH ?? "";

    if (hashParams && hashParamsVal) {
      const calculatedHash = createHash("sha512")
        .update(hashParamsVal + config.storeKey)
        .digest("base64");

      if (calculatedHash !== bankHash) {
        return {
          success: false,
          orderId,
          error: "Hash dogrulama basarisiz — olasi sahte islem",
          rawResponse: formData,
        };
      }
    }

    // Check 3D authentication status
    // mdStatus: 1 = full auth, 2 = card not enrolled (half secure), 3 = auth failed, etc.
    const validMdStatus = ["1", "2", "3", "4"];
    if (!validMdStatus.includes(mdStatus)) {
      return {
        success: false,
        orderId,
        error: `3D dogrulama basarisiz (mdStatus: ${mdStatus})`,
        rawResponse: formData,
      };
    }

    // Check transaction result
    if (procReturnCode !== "00" || response !== "Approved") {
      return {
        success: false,
        orderId,
        error: `Odeme reddedildi (kod: ${procReturnCode}, yanit: ${response})`,
        rawResponse: formData,
      };
    }

    return {
      success: true,
      orderId,
      transactionId,
      amount,
      rawResponse: formData,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Callback dogrulama hatasi";
    return {
      success: false,
      orderId: formData.oid ?? "",
      error: message,
      rawResponse: formData,
    };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Check if Halkbank POS is configured
 */
export function isHalkbankConfigured(): boolean {
  return Boolean(
    process.env.HALKBANK_MERCHANT_ID &&
    process.env.HALKBANK_TERMINAL_ID &&
    process.env.HALKBANK_STORE_KEY &&
    process.env.HALKBANK_3D_URL
  );
}
