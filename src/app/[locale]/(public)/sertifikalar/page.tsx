import { getCertificates } from "@/lib/content";
import CertificatesClient from "@/components/pages/CertificatesClient";

export default async function SertifikalarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const certificates = await getCertificates();
  return <CertificatesClient certificates={certificates} />;
}
