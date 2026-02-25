export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-4xl font-bold text-neutral-900 mb-3">404</h2>
        <p className="text-neutral-600 mb-6">Bu admin sayfası bulunamadı.</p>
        <a href="/admin" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block">
          Dashboard&apos;a Dön
        </a>
      </div>
    </div>
  );
}
