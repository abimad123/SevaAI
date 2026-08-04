import { Link } from 'react-router-dom';
import { Home, Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 text-center">
      <div>
        <div className="w-24 h-24 rounded-3xl bg-blue-700 flex items-center justify-center mx-auto mb-6 shadow-md">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <p className="text-8xl font-black text-blue-700 font-display mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Page Not Found</h1>
        <p className="text-slate-600 mb-8 max-w-sm mx-auto font-medium">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary"><Home className="w-4 h-4" /> Go Home</Link>
          <button onClick={() => window.history.back()} className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Go Back</button>
        </div>
      </div>
    </div>
  );
}
