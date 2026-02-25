export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div
        className="flex flex-col items-center gap-6"
        style={{ animation: "fade-in 0.4s ease-out" }}
      >
        {/* Animated K Logo */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* Outer ring pulse */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, var(--primary-900), var(--primary-500))",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          />
          {/* Shimmer overlay */}
          <div
            className="absolute inset-0 rounded-2xl opacity-40"
            style={{
              background:
                "linear-gradient(90deg, transparent 30%, var(--accent-400) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s ease-in-out infinite",
            }}
          />
          {/* K letter */}
          <span
            className="relative text-3xl font-black tracking-tight text-white"
            style={{ animation: "scale-in 0.5s ease-out" }}
          >
            K
          </span>
        </div>

        {/* Brand text */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-bold tracking-tight text-primary-900">
            KİSMET
          </span>
          <span className="text-[10px] font-semibold tracking-[0.3em] text-neutral-400">
            PLASTİK
          </span>
        </div>

        {/* Loading bar */}
        <div className="h-[2px] w-32 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"
            style={{
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
        </div>

        <span className="text-xs font-medium text-neutral-400">
          Yükleniyor...
        </span>
      </div>
    </div>
  );
}
