/**
 * Generates an iCal (RFC 5545) formatted string for a calendar event.
 */
export function generateICalEvent(event: {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
}): string {
  const formatDate = (dateStr: string): string => {
    // Convert ISO date (YYYY-MM-DD) to iCal all-day format (YYYYMMDD)
    return dateStr.replace(/-/g, "");
  };

  // For all-day events, the DTEND should be the day AFTER the last day
  const endDateObj = new Date(event.endDate);
  endDateObj.setDate(endDateObj.getDate() + 1);
  const endDateFormatted = endDateObj.toISOString().split("T")[0].replace(/-/g, "");

  const now = new Date();
  const dtstamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  // Escape special characters per RFC 5545
  const escapeText = (text: string): string => {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  };

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kismet Plastik//Trade Shows//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${formatDate(event.startDate)}`,
    `DTEND;VALUE=DATE:${endDateFormatted}`,
    `DTSTAMP:${dtstamp}`,
    `UID:${formatDate(event.startDate)}-${encodeURIComponent(event.title)}@kismetplastik.com`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

/**
 * Creates a Blob from the iCal string and triggers a file download.
 */
export function downloadICalEvent(event: Parameters<typeof generateICalEvent>[0]): void {
  const icalContent = generateICalEvent(event);
  const blob = new Blob([icalContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the object URL after a short delay
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
