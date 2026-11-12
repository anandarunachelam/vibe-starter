import React, { useState, useMemo } from 'react';
import { NewsArticle, SymbolData } from '../../types/market';
import { Newspaper, Search, ExternalLink, Clock, Sparkles } from 'lucide-react';

interface NewsScreenProps {
  articles: NewsArticle[];
  symbols: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const NewsScreen: React.FC<NewsScreenProps> = ({
  articles,
  symbols,
  onSelectSymbol,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingArticle, setReadingArticle] = useState<NewsArticle | null>(null);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
      if (!searchQuery) return matchesCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.relatedSymbols.some((s) => s.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const handleSymbolClick = (symStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const match = symbols.find((s) => s.symbol === symStr || s.symbol.startsWith(symStr));
    if (match) onSelectSymbol(match);
  };

  return (
    <div className="space-y-4">
      {/* News Controls Header */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[#2962ff]" />
          <h2 className="font-bold text-white text-sm">Real-Time Financial & Macro News Wire</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#787b86] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news & tickers..."
              className="bg-[#131722] border border-[#2a2e39] rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-[#787b86] outline-none w-36 sm:w-48 focus:border-[#2962ff]"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39] overflow-x-auto">
            {[
              { id: 'all', label: 'All News' },
              { id: 'stocks', label: 'Stocks' },
              { id: 'crypto', label: 'Crypto' },
              { id: 'macro', label: 'Macro & Fed' },
              { id: 'forex', label: 'Forex' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setReadingArticle(article)}
            className="bg-[#1e222d] border border-[#2a2e39] hover:border-[#383e4e] rounded-xl p-4 transition-all hover:bg-[#252a37] cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#787b86] mb-2">
                <span className="font-semibold text-[#9598a1]">{article.source}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{article.timeAgo}</span>
                </span>
              </div>

              <h3 className="font-bold text-white text-sm group-hover:text-[#2962ff] transition-colors leading-snug mb-2">
                {article.title}
              </h3>

              <p className="text-xs text-[#9598a1] leading-relaxed line-clamp-3 mb-4">
                {article.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[#2a2e39]/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                {article.relatedSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={(e) => handleSymbolClick(sym, e)}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#131722] text-[#2962ff] hover:bg-[#2962ff] hover:text-white border border-[#2a2e39] transition-colors font-bold cursor-pointer"
                  >
                    ${sym}
                  </button>
                ))}
              </div>

              <span className="text-[11px] text-[#787b86]">{article.readTime}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Full Reader Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e222d] border border-[#2a2e39] text-[#d1d4dc] rounded-xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between text-xs text-[#787b86] mb-3">
              <span>{readingArticle.source} · {readingArticle.timeAgo} · {readingArticle.readTime}</span>
              <button
                onClick={() => setReadingArticle(null)}
                className="p-1 hover:bg-[#2a2e39] text-white rounded"
              >
                ✕
              </button>
            </div>

            <h2 className="text-xl font-bold text-white mb-4 leading-snug">
              {readingArticle.title}
            </h2>

            <div className="space-y-3 text-sm text-[#9598a1] leading-relaxed mb-6">
              <p>{readingArticle.summary}</p>
              <p>
                Market analysts note that cross-asset liquidity conditions remain resilient across primary settlement venues. Continued volatility compression is expected as institutional desks reposition following recent economic data prints.
              </p>
              <p>
                Volume distribution remains skewed toward large-cap components, while options open interest displays elevated hedging activity into upcoming quarterly options expiration dates.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#2a2e39] text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#787b86]">Referenced Symbols:</span>
                {readingArticle.relatedSymbols.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => {
                      setReadingArticle(null);
                      handleSymbolClick(s, e);
                    }}
                    className="font-mono text-[#2962ff] font-bold hover:underline"
                  >
                    ${s}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setReadingArticle(null)}
                className="px-4 py-1.5 bg-[#2962ff] hover:bg-[#1e53e5] text-white rounded font-medium cursor-pointer"
              >
                Back to Feed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
