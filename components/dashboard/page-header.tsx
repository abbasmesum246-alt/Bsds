export function PageHeader({ title, description, action, icon }: { title: string; description?: string; action?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div className="flex items-center gap-3 min-w-0">
        {icon && <div className="h-11 w-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">{icon}</div>}
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-ink-900 tracking-tight truncate">{title}</h1>
          {description && <p className="text-sm text-ink-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
}
