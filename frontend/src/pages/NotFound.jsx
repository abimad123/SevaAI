import { Link } from 'react-router-dom';
import { Home, Sparkles, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 text-center">
      <div>
        <div className="w-24 h-24 rounded-3xl bg-blue-700 flex items-center justify-center mx-auto mb-6 shadow-md">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <p className="text-8xl font-black text-blue-700 font-display mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">{t('not_found.title')}</h1>
        <p className="text-slate-600 mb-8 max-w-sm mx-auto font-medium">{t('not_found.desc')}</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary"><Home className="w-4 h-4" /> {t('not_found.go_home')}</Link>
          <button onClick={() => window.history.back()} className="btn-secondary"><ArrowLeft className="w-4 h-4" /> {t('not_found.go_back')}</button>
        </div>
      </div>
    </div>
  );
}
