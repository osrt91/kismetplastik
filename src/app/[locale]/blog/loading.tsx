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

function FeaturedCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
      <SkeletonBox className="h-48 w-full !rounded-none" />
      <div className="space-y-3 p-6">
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-6 w-16 !rounded-full" />
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-4 w-14" />
        </div>
        <SkeletonBox className="h-6 w-4/5" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="mt-2 h-1 w-full !rounded-full" />
        <SkeletonBox className="h-5 w-28" />
      </div>
    </div>
  );
}

function SmallCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
      <SkeletonBox className="h-28 w-full !rounded-none" />
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-5 w-14 !rounded-full" />
        </div>
        <SkeletonBox className="h-5 w-full" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-2/3" />
        <SkeletonBox className="mt-1 h-1 w-full !rounded-full" />
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-3 w-20" />
          <SkeletonBox className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <section
      className="bg-white"
      style={{ animation: "fade-in 0.3s ease-out" }}
    >
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-6 flex items-center gap-1.5">
            <SkeletonBox className="h-4 w-16 !bg-white/10" />
            <SkeletonBox className="h-4 w-4 !bg-white/10" />
            <SkeletonBox className="h-4 w-10 !bg-white/10" />
          </div>
          <SkeletonBox className="mb-3 h-10 w-72 !bg-white/10" />
          <SkeletonBox className="h-6 w-[28rem] max-w-full !bg-white/10" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        {/* Category filter skeleton */}
        <div className="mb-10 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBox key={i} className="h-10 w-20 !rounded-xl" />
          ))}
        </div>

        {/* Featured cards */}
        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          <FeaturedCardSkeleton />
          <FeaturedCardSkeleton />
        </div>

        {/* Small cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SmallCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
