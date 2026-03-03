export interface TradeShow {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  location: string;
  locationEn: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  booth?: string;
  website?: string;
  status: "upcoming" | "past";
}

export const tradeShows: TradeShow[] = [
  {
    id: "beautyworld-middle-east-2026",
    name: "Beautyworld Middle East 2026",
    nameEn: "Beautyworld Middle East 2026",
    description:
      "Orta Dogu'nun en buyuk guzellik ve kozmetik fuari. Kismet Plastik olarak en yeni PET sise ve ambalaj cozumlerimizi sergileyecegiz. Bolgedeki distributorluk firsatlari icin standimizi ziyaret edin.",
    descriptionEn:
      "The largest beauty and cosmetics trade fair in the Middle East. Kismet Plastik will showcase our latest PET bottle and packaging solutions. Visit our booth for distribution opportunities in the region.",
    location: "Dubai World Trade Centre, Dubai, BAE",
    locationEn: "Dubai World Trade Centre, Dubai, UAE",
    startDate: "2026-10-05",
    endDate: "2026-10-07",
    booth: "Hall 3, Stand B42",
    website: "https://www.beautyworldme.com",
    status: "upcoming",
  },
  {
    id: "cosmoprof-bologna-2026",
    name: "Cosmoprof Worldwide Bologna 2026",
    nameEn: "Cosmoprof Worldwide Bologna 2026",
    description:
      "Dunyanin en prestijli kozmetik ambalaj fuari. Surdurulebilir ambalaj cozumlerimizi ve yeni urun serilerimizi tanitmak icin Bologna'dayiz. Avrupa pazari icin is birligi firsatlari icin bekliyoruz.",
    descriptionEn:
      "The world's most prestigious cosmetic packaging trade fair. We will be in Bologna to present our sustainable packaging solutions and new product lines. We look forward to collaboration opportunities for the European market.",
    location: "BolognaFiere, Bologna, Italya",
    locationEn: "BolognaFiere, Bologna, Italy",
    startDate: "2026-04-23",
    endDate: "2026-04-25",
    booth: "Pavilion 20, Stand C18",
    website: "https://www.cosmoprof.com",
    status: "upcoming",
  },
  {
    id: "istanbul-ambalaj-fuari-2025",
    name: "Istanbul Ambalaj Fuari 2025",
    nameEn: "Istanbul Packaging Fair 2025",
    description:
      "Turkiye'nin en buyuk ambalaj ve plastik fuari. PET sise, kapak, pompa ve tetikli pusturtucu urunlerimizi sergiledik. Yurt ici ve yurt disi musterilerimizle verimli gorusmeler gerceklestirdik.",
    descriptionEn:
      "Turkey's largest packaging and plastics fair. We exhibited our PET bottles, caps, pumps, and trigger sprayer products. We held productive meetings with our domestic and international customers.",
    location: "TUYAP Fuar ve Kongre Merkezi, Istanbul, Turkiye",
    locationEn: "TUYAP Fair and Congress Center, Istanbul, Turkey",
    startDate: "2025-09-17",
    endDate: "2025-09-20",
    booth: "Hall 5, Stand D10",
    website: "https://www.istanbulambalajfuari.com",
    status: "past",
  },
];
