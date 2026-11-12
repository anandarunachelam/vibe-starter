import React, { useState } from 'react';
import { SymbolData, NewsArticle, TreemapNode } from '../../types/market';
import { Sparkline } from '../Sparkline';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Layers, 
  Globe, 
  Flame, 
  Percent, 
  Newspaper,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface OverviewScreenProps {
  symbols: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
  onNavigateTab: (tab: any) => void;
  heatmapData: TreemapNode[];
  newsArticles: NewsArticle[];
  currencyCrossRates: any[];
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  symbols,
  onSelectSymbol,
  onNavigateTab,
  heatmapData,
  newsArticles,
  currencyCrossRates,
}) => {
  const [snapshotRegion, setSnapshotRegion] = useState<'americas' | 'europe' | 'asia' | 'crypto'>('americas');
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  // Key hero spotlight assets
  const heroSymbols = ['SPX', 'NDX', 'BTCUSDT', 'XAUUSD'];
  const heroAssets = heroSymbols
    .map((sym) => symbols.find((s) => s.symbol === sym))
    .filter(Boolean) as SymbolData[];

  // Market movers
  const topGainers = [...symbols]
    .filter((s) => s.category === 'stock' || s.category === 'crypto')
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);

  const topLosers = [...symbols]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  const mostActive = [...symbols]
    .filter((s) => s.category === 'stock')
    .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
    .slice(0, 5);

  // Filter snapshot symbols
  const snapshotSymbols = symbols.filter((s) => {
    if (snapshotRegion === 'americas') return s.country === 'United States' && s.category === 'index';
    if (snapshotRegion === 'europe') return (s.country === 'Germany' || s.country === 'United Kingdom') && (s.category === 'index' || s.category === 'bond');
    if (snapshotRegion === 'asia') return s.country === 'Japan' || s.symbol === 'N225';
    if (snapshotRegion === 'crypto') return s.category === 'crypto';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Hero Spotlight Strip: Top 4 Market Anchors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {heroAssets.map((item) => {
          const isPos = item.changePercent >= 0;
          return (
            <button
              key={item.symbol}
              onClick={() => onSelectSymbol(item)}
              className="bg-[#1e222d] hover:bg-[#252a37] border border-[#2a2e39] hover:border-[#383e4e] p-4 rounded-xl text-left transition-all group shadow-sm flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white text-base group-hover:text-[#2962ff] transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#787b86] uppercase bg-[#131722] px-1.5 py-0.5 rounded">
                    {item.symbol}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-mono text-2xl font-bold text-white tabular-nums tracking-tight">
                    {item.price > 1000
                      ? item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : item.price.toFixed(2)}
                  </span>
                  <span
                    className={`inline-flex items-center text-xs font-mono font-semibold ${
                      isPos ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Sparkline & Range bar */}
              <div className="pt-2 border-t border-[#2a2e39]/50 flex items-end justify-between">
                <div className="text-[10px] text-[#787b86] font-mono">
                  <div>H: {item.high24h.toFixed(1)}</div>
                  <div>L: {item.low24h.toFixed(1)}</div>
                </div>
                <div className="w-28">
                  <Sparkline data={item.sparkline} isPositive={isPos} width={110} height={28} strokeWidth={1.75} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Global Market Snapshot & Regional Benchmark Tabs */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b border-[#2a2e39] bg-[#181b24]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#2962ff]" />
            <h2 className="font-bold text-white text-sm">Global Market Snapshot</h2>
          </div>

          <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
            {(
              [
                { id: 'americas', label: 'Americas' },
                { id: 'europe', label: 'Europe' },
                { id: 'asia', label: 'Asia-Pacific' },
                { id: 'crypto', label: 'Crypto' },
              ] as const
            ).map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSnapshotRegion(reg.id)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  snapshotRegion === reg.id
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Snapshot Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#131722] text-[#787b86] uppercase font-mono text-[10px] border-b border-[#2a2e39]">
              <tr>
                <th className="px-4 py-2.5">Symbol / Index</th>
                <th className="px-4 py-2.5 text-right">Price</th>
                <th className="px-4 py-2.5 text-right">Change</th>
                <th className="px-4 py-2.5 text-right">% Change</th>
                <th className="px-4 py-2.5 text-center">Trend (24h)</th>
                <th className="px-4 py-2.5 text-right hidden md:table-cell">Technical</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50 font-mono tabular-nums">
              {snapshotSymbols.map((item) => {
                const isPos = item.changePercent >= 0;
                return (
                  <tr
                    key={item.symbol}
                    className="hover:bg-[#252a37] transition-colors group cursor-pointer"
                    onClick={() => onSelectSymbol(item)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                          {item.symbol}
                        </span>
                        <span className="text-[11px] text-[#787b86] font-sans truncate max-w-[150px]">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-white">
                      {item.price > 1000 ? item.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : item.price.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{item.change.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <Sparkline data={item.sparkline} isPositive={isPos} width={70} height={20} strokeWidth={1.5} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-sans ${
                        item.technicalRating.includes('Buy')
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : item.technicalRating.includes('Sell')
                          ? 'bg-[#f23645]/15 text-[#f23645]'
                          : 'bg-[#2a2e39] text-[#787b86]'
                      }`}>
                        {item.technicalRating}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSymbol(item);
                        }}
                        className="p-1 rounded hover:bg-[#2a2e39] text-[#787b86] hover:text-white"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Market Movers Tri-Column Grid: Gainers, Losers, Most Active */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Gainers */}
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2e39] bg-[#181b24]">
            <div className="flex items-center gap-1.5 font-bold text-white text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-[#089981]" />
              <span>Top Gainers</span>
            </div>
            <button
              onClick={() => onNavigateTab('screener')}
              className="text-[11px] text-[#2962ff] hover:underline flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-[#2a2e39]/50">
            {topGainers.map((item) => (
              <div
                key={item.symbol}
                onClick={() => onSelectSymbol(item)}
                className="flex items-center justify-between p-3 hover:bg-[#252a37] transition-colors cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-[#2962ff]">
                    {item.symbol}
                  </div>
                  <div className="text-[11px] text-[#787b86] truncate max-w-[130px]">
                    {item.name}
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="text-xs font-semibold text-white">
                    ${item.price > 1000 ? item.price.toLocaleString() : item.price.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-bold text-[#089981]">
                    +{item.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2e39] bg-[#181b24]">
            <div className="flex items-center gap-1.5 font-bold text-white text-xs">
              <TrendingDown className="w-3.5 h-3.5 text-[#f23645]" />
              <span>Top Losers</span>
            </div>
            <button
              onClick={() => onNavigateTab('screener')}
              className="text-[11px] text-[#2962ff] hover:underline flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-[#2a2e39]/50">
            {topLosers.map((item) => (
              <div
                key={item.symbol}
                onClick={() => onSelectSymbol(item)}
                className="flex items-center justify-between p-3 hover:bg-[#252a37] transition-colors cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-[#2962ff]">
                    {item.symbol}
                  </div>
                  <div className="text-[11px] text-[#787b86] truncate max-w-[130px]">
                    {item.name}
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="text-xs font-semibold text-white">
                    ${item.price > 1000 ? item.price.toLocaleString() : item.price.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-bold text-[#f23645]">
                    {item.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Active Volume */}
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2e39] bg-[#181b24]">
            <div className="flex items-center gap-1.5 font-bold text-white text-xs">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Most Active Volume</span>
            </div>
            <button
              onClick={() => onNavigateTab('stocks')}
              className="text-[11px] text-[#2962ff] hover:underline flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-[#2a2e39]/50">
            {mostActive.map((item) => (
              <div
                key={item.symbol}
                onClick={() => onSelectSymbol(item)}
                className="flex items-center justify-between p-3 hover:bg-[#252a37] transition-colors cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-[#2962ff]">
                    {item.symbol}
                  </div>
                  <div className="text-[11px] text-[#787b86]">
                    Vol: <strong className="text-[#d1d4dc]">{item.volume}</strong>
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="text-xs font-semibold text-white">
                    ${item.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-[11px] font-bold ${
                      item.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. S&P 500 Mini Heatmap Treemap Preview */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2962ff]" />
            <h2 className="font-bold text-white text-sm">S&P 500 Market Heatmap Preview</h2>
          </div>
          <button
            onClick={() => onNavigateTab('heatmap')}
            className="text-xs text-[#2962ff] hover:underline font-semibold flex items-center gap-1"
          >
            <span>Open Interactive Heatmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {heatmapData.slice(0, 12).map((item) => {
            const isPos = item.changePercent >= 0;
            const bgColor = isPos
              ? item.changePercent > 3 ? 'bg-[#089981]' : 'bg-[#089981]/80'
              : item.changePercent < -2 ? 'bg-[#f23645]' : 'bg-[#f23645]/80';

            const matchedSymbol = symbols.find((s) => s.symbol === item.symbol);

            return (
              <button
                key={item.symbol}
                onClick={() => matchedSymbol && onSelectSymbol(matchedSymbol)}
                className={`${bgColor} text-white p-3 rounded-lg flex flex-col justify-between hover:brightness-110 transition-all text-left shadow-sm min-h-[85px] cursor-pointer`}
              >
                <div>
                  <div className="font-extrabold text-sm">{item.symbol}</div>
                  <div className="text-[10px] opacity-80 truncate">{item.name}</div>
                </div>
                <div className="font-mono text-xs font-bold tabular-nums">
                  {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. World Currency Cross-Rates Grid */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2e39] bg-[#181b24]">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#2962ff]" />
            <h2 className="font-bold text-white text-sm">Currency Cross-Rates Matrix</h2>
          </div>
          <button
            onClick={() => onNavigateTab('forex')}
            className="text-xs text-[#2962ff] hover:underline font-semibold flex items-center gap-1"
          >
            <span>Forex Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono tabular-nums">
            <thead className="bg-[#131722] text-[#787b86] uppercase text-[10px] border-b border-[#2a2e39]">
              <tr>
                <th className="px-4 py-2.5">BASE</th>
                <th className="px-4 py-2.5 text-right">USD</th>
                <th className="px-4 py-2.5 text-right">EUR</th>
                <th className="px-4 py-2.5 text-right">GBP</th>
                <th className="px-4 py-2.5 text-right">JPY</th>
                <th className="px-4 py-2.5 text-right">AUD</th>
                <th className="px-4 py-2.5 text-right">CAD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {currencyCrossRates.map((row) => (
                <tr key={row.base} className="hover:bg-[#252a37] transition-colors">
                  <td className="px-4 py-2.5 font-bold text-white font-sans">{row.base}</td>
                  <td className="px-4 py-2.5 text-right">{row.USD ? row.USD.toFixed(4) : '1.0000'}</td>
                  <td className="px-4 py-2.5 text-right">{row.EUR ? row.EUR.toFixed(4) : '1.0000'}</td>
                  <td className="px-4 py-2.5 text-right">{row.GBP ? row.GBP.toFixed(4) : '1.0000'}</td>
                  <td className="px-4 py-2.5 text-right">{row.JPY ? row.JPY.toFixed(2) : '1.00'}</td>
                  <td className="px-4 py-2.5 text-right">{row.AUD ? row.AUD.toFixed(4) : '1.0000'}</td>
                  <td className="px-4 py-2.5 text-right">{row.CAD ? row.CAD.toFixed(4) : '1.0000'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Top Financial News & Market Wire */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2e39] bg-[#181b24]">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[#2962ff]" />
            <h2 className="font-bold text-white text-sm">Top Market Stories & Macro Analysis</h2>
          </div>
          <button
            onClick={() => onNavigateTab('news')}
            className="text-xs text-[#2962ff] hover:underline font-semibold flex items-center gap-1"
          >
            <span>Full News Wire</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#2a2e39]/50">
          {newsArticles.slice(0, 4).map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedNews(article)}
              className="p-4 hover:bg-[#252a37] transition-colors cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 text-[11px] text-[#787b86] mb-1.5">
                  <span className="font-semibold text-[#9598a1]">{article.source}</span>
                  <span>·</span>
                  <span>{article.timeAgo}</span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-[#2962ff] transition-colors leading-snug mb-2">
                  {article.title}
                </h3>
                <p className="text-xs text-[#9598a1] line-clamp-2 leading-relaxed mb-3">
                  {article.summary}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {article.relatedSymbols.map((sym) => (
                  <span
                    key={sym}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131722] text-[#d1d4dc] border border-[#2a2e39]"
                  >
                    ${sym}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Preview Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e222d] border border-[#2a2e39] text-[#d1d4dc] rounded-xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between text-xs text-[#787b86] mb-3">
              <span>{selectedNews.source} · {selectedNews.timeAgo}</span>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-1 hover:bg-[#2a2e39] text-white rounded"
              >
                ✕
              </button>
            </div>
            <h2 className="text-xl font-bold text-white mb-4 leading-tight">
              {selectedNews.title}
            </h2>
            <p className="text-sm text-[#9598a1] leading-relaxed mb-6">
              {selectedNews.summary}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-[#2a2e39] text-xs">
              <div className="flex items-center gap-2">
                {selectedNews.relatedSymbols.map((s) => (
                  <span key={s} className="font-mono text-[#2962ff] font-bold">
                    ${s}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-1.5 bg-[#2962ff] hover:bg-[#1e53e5] text-white rounded font-medium"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
