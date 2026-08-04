import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchemes, fetchCategories } from '../../store/slices/schemeSlice';
import { Link } from 'react-router-dom';
import { Search, Filter, Globe, IndianRupee, FileText, ChevronRight, Sparkles, X } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { useTranslation } from 'react-i18next';

export default function SchemeSearch() {
  const dispatch = useDispatch();
  const { schemes, categories, loading, pagination } = useSelector((s) => s.schemes);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();

  const categoryLabels = {
    education: t('schemes.category_education'),
    health: t('schemes.category_health'),
    women_empowerment: t('schemes.category_women_empowerment'),
    rural_development: t('schemes.category_rural_development'),
    skill_development: t('schemes.category_skill_development'),
    agriculture: t('schemes.category_agriculture'),
    environment: t('schemes.category_environment'),
    social_welfare: t('schemes.category_social_welfare'),
    housing: t('schemes.category_housing'),
    livelihood: t('schemes.category_livelihood'),
    children: t('schemes.category_children'),
    elderly: t('schemes.category_elderly'),
    disability: t('schemes.category_disability'),
    other: t('schemes.category_other'),
  };

  const levelOptions = [
    { value: '', label: t('schemes.level_all') },
    { value: 'central', label: t('schemes.level_central') },
    { value: 'state', label: t('schemes.level_state') },
    { value: 'district', label: t('schemes.level_district') },
  ];

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchSchemes({ search, category, level, page, limit: 12 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, search, category, level, page]);

  const clearFilters = () => { setSearch(''); setCategory(''); setLevel(''); setPage(1); };
  const hasFilters = search || category || level;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="relative py-16 px-6 border-b border-slate-200 overflow-hidden bg-white">
        <div className="absolute inset-0 gradient-hero opacity-60" />
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm mb-5">
            <Globe className="w-4 h-4" /> {t('schemes.badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-slate-900 mb-4">
            {t('schemes.hero_title')} <span className="text-blue-700">{t('schemes.hero_title_span')}</span>
          </h1>
          <p className="text-slate-600 text-lg mb-8">{t('schemes.hero_desc')}</p>

          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                className="input-field pl-12 py-3.5 text-base"
                placeholder={t('schemes.placeholder_search')}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                id="scheme-search"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary px-4 py-3.5 ${showFilters ? 'border-blue-700 text-blue-700' : ''}`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 justify-center mt-4 fade-in-up">
              <select className="input-field w-auto py-2 text-sm" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} id="filter-category">
                <option value="">{t('schemes.filter_all_categories')}</option>
                {Object.entries(categoryLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <select className="input-field w-auto py-2 text-sm" value={level} onChange={(e) => { setLevel(e.target.value); setPage(1); }} id="filter-level">
                {levelOptions.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
              {hasFilters && (
                <button onClick={clearFilters} className="btn-secondary py-2 text-sm flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50">
                  <X className="w-4 h-4" /> {t('schemes.filter_clear')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setCategory('')} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${!category ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'}`}>
            {t('schemes.filter_all')} ({pagination?.total || 0})
          </button>
          {categories.slice(0, 8).map((c) => (
            <button key={c._id} onClick={() => { setCategory(c._id); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${category === c._id ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'}`}>
              {categoryLabels[c._id] || c._id} ({c.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="h-52 shimmer rounded-2xl" />)}
          </div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <Globe className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('schemes.no_schemes_found')}</h3>
            <p className="text-slate-600 mb-6 font-medium">{t('schemes.no_schemes_desc')}</p>
            <button onClick={clearFilters} className="btn-primary">{t('schemes.filter_clear')}</button>
          </div>
        ) : (
          <>
            <p className="text-slate-600 font-medium text-sm mb-4">{pagination?.total || 0} {t('schemes.found_count')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {schemes.map((scheme) => (
                <SchemeCard key={scheme._id} scheme={scheme} categoryLabels={categoryLabels} />
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {[...Array(Math.min(pagination.pages, 5))].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === i + 1 ? 'bg-blue-700 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center shadow-sm">
          <Sparkles className="w-10 h-10 text-blue-700 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">{t('schemes.recommendations_title')}</h3>
          <p className="text-slate-600 font-medium mb-5 text-sm">{t('schemes.recommendations_desc')}</p>
          <Link to="/chat" className="btn-primary">
            <Sparkles className="w-4 h-4" /> {t('schemes.recommendations_action')}
          </Link>
        </div>
      </div>
    </div>
  );
}

function SchemeCard({ scheme, categoryLabels }) {
  const { t } = useTranslation();
  const catColors = {
    education: 'indigo', health: 'emerald', women_empowerment: 'pink',
    rural_development: 'amber', skill_development: 'cyan', other: 'slate',
  };
  const color = catColors[scheme.category] || 'indigo';
  const colorMap = {
    indigo: 'text-blue-700 bg-blue-50 border border-blue-100', emerald: 'text-emerald-700 bg-emerald-50 border border-emerald-100',
    pink: 'text-pink-700 bg-pink-50 border border-pink-100', amber: 'text-amber-800 bg-amber-50 border border-amber-100',
    cyan: 'text-cyan-700 bg-cyan-50 border border-cyan-100', slate: 'text-slate-600 bg-slate-50 border border-slate-100',
  };

  const translatedLevel = {
    central: t('schemes.level_central'),
    state: t('schemes.level_state'),
    district: t('schemes.level_district'),
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 card-hover flex flex-col shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
          <Globe className="w-5 h-5" />
        </div>
        <div className="flex flex-wrap gap-1 justify-end">
          <Badge variant={scheme.level === 'central' ? 'primary' : 'info'} className="text-xs capitalize">{translatedLevel[scheme.level] || scheme.level}</Badge>
          {scheme.deadline?.isOngoing && <Badge variant="success" className="text-xs">{t('schemes.badge_ongoing')}</Badge>}
        </div>
      </div>

      <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">{scheme.name}</h3>
      <p className="text-slate-600 text-sm mb-3 line-clamp-2 flex-1 leading-relaxed">{scheme.shortDescription || scheme.description}</p>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <FileText className="w-3.5 h-3.5" />
          <span>{scheme.department}</span>
        </div>
        {scheme.benefits?.financialAmount > 0 && (
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>{t('schemes.label_up_to')} ₹{scheme.benefits.financialAmount.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {scheme.focusAreas?.slice(0, 3).map((f) => (
          <span key={f} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold capitalize">
            {t('ngo.focus_area_' + f.toLowerCase().replace(' ', '_')) || f.replace('_', ' ')}
          </span>
        ))}
      </div>

      <Link to={`/schemes/${scheme._id}`}
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
        {t('schemes.view_details')} <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
