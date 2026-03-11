export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-3 w-36 bg-f-raised rounded mb-3" />
      <div className="h-9 w-56 bg-f-raised rounded mb-3" />
      <div className="h-4 w-48 bg-f-raised rounded mb-12" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-f-border bg-f-surface h-20" />
        ))}
      </div>
      <div className="h-6 w-24 bg-f-raised rounded mb-4" />
      <div className="rounded-2xl border border-f-border bg-f-surface h-64" />
    </div>
  )
}
