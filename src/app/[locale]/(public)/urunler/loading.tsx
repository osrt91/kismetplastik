function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-neutral-200 ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(90deg, #e5e5e5 30%, #f0f0f0 50%, #e5e5e5 70%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s ease-in-out infinite",
      }}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
      <SkeletonBox className="aspect-square w-full !rounded-none" />
      <div className="space-y-3 p-4">
        <SkeletonBox className="h-5 w-3/4" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-1/2" />
        <SkeletonBox className="h-6 w-20 !rounded-full" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <section
      className="bg-neutral-50 py-12 lg:py-20"
      style={{ animation: "fade-in 0.3s ease-out" }}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Header skeleton */}
        <div className="mb-10 space-y-3">
          <SkeletonBox className="h-4 w-32" />
          <SkeletonBox className="h-9 w-72" />
          <SkeletonBox className="h-5 w-96 max-w-full" />
        </div>

        {/* Filter bar skeleton */}
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-4">
          <SkeletonBox className="h-10 w-64 max-w-full" />
          <SkeletonBox className="h-10 w-36" />
          <SkeletonBox className="h-10 w-36" />
          <SkeletonBox className="h-10 w-36" />
        </div>

        {/* Product grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
