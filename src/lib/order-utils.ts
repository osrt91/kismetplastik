/**
 * Generates a B2B order number in the format KP-YYMM-NNNN
 * @param sequence - The sequential number for the order
 * @param date - Optional date to use for YY/MM (defaults to now)
 * @returns Formatted order number string
 */
export function generateB2BOrderNumber(
  sequence: number,
  date: Date = new Date()
): string {
  if (!Number.isInteger(sequence) || sequence < 1) {
    throw new Error("Sequence must be a positive integer")
  }
  if (sequence > 9999) {
    throw new Error("Sequence exceeds maximum value (9999)")
  }

  const yy = date.getFullYear().toString().slice(-2)
  const mm = (date.getMonth() + 1).toString().padStart(2, "0")
  const seq = sequence.toString().padStart(4, "0")

  return `KP-${yy}${mm}-${seq}`
}
