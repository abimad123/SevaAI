export default function Card({ children, className = '', hover = false, glass = false }) {
  return (
    <div
      className={`
        rounded-xl p-6 
        ${glass ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function StatsCard({ label, value, icon: Icon, change, color = 'indigo', className = '' }) {
  const colors = {
    indigo: 'text-blue-700 bg-blue-50 border border-blue-100',
    emerald: 'text-emerald-700 bg-emerald-50 border border-emerald-100',
    amber: 'text-amber-800 bg-amber-50 border border-amber-100',
    cyan: 'text-cyan-700 bg-cyan-50 border border-cyan-100',
    violet: 'text-indigo-700 bg-indigo-50 border border-indigo-100',
  };
  return (
    <Card className={`${className}`} hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-1 ${change >= 0 ? 'text-emerald-700 font-semibold' : 'text-red-600 font-semibold'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
}
