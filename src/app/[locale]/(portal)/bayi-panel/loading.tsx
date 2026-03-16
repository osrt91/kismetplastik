export default function BayiPanelLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Yukleniyor...</p>
      </div>
    </div>
  );
}
