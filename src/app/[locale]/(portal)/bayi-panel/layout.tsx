import type { Metadata } from "next";
import BayiPanelClientLayout from "./client-layout";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BayiPanelLayout({ children }: { children: React.ReactNode }) {
  return <BayiPanelClientLayout>{children}</BayiPanelClientLayout>;
}
