export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-blue-50 text-blue-700 border border-blue-100',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-800 border border-amber-100',
    danger: 'bg-red-50 text-red-800 border border-red-100',
    info: 'bg-cyan-50 text-cyan-800 border border-cyan-100',
    active: 'status-active',
    pending: 'status-pending',
    rejected: 'status-rejected',
    draft: 'status-draft',
    completed: 'status-completed',
  };
  return (
    <span className={`badge ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
