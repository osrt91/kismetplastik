import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-4xl font-bold text-foreground mb-3">404</h2>
        <p className="text-muted-foreground mb-6">Bu admin sayfası bulunamadı.</p>
        <Link href="/admin" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block">
          Dashboard&apos;a Dön
        </Link>
      </div>
    </div>
  );
}
