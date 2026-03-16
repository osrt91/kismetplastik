import { getTradeShows } from "@/lib/content";
import TradeShowsClient from "@/components/pages/TradeShowsClient";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const tradeShows = await getTradeShows();
  return <TradeShowsClient tradeShows={tradeShows} />;
}
