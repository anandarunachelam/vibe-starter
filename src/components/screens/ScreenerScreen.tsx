import React, { useState, useMemo } from 'react';
import { SymbolData, AssetCategory, TechnicalRating } from '../../types/market';
import { Sparkline } from '../Sparkline';
import { 
  Filter, 
  Search, 
  ArrowUpDown, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

interface ScreenerScreenProps {
  symbols: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const ScreenerScreen: React.FC<ScreenerScreenProps> = ({
  symbols,
  onSelectSymbol,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [perfFilter, setPerfFilter] = useState<string>('all'); // all, gainers, losers, extreme
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const filteredSymbols = useMemo(() => {
    return symbols
      .filter((s) => {
        if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
        if (ratingFilter !== 'all' && s.technicalRating !== ratingFilter) return false;
        if (perfFilter === 'gainers' && s.changePercent <= 0) return false;
        if (perfFilter === 'losers' && s.changePercent >= 0) return false;
        if (perfFilter === 'extreme' && Math.abs(s.changePercent) < 3.0) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase().trim();
          return (
            s.symbol.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q) ||
            s.exchange.toLowerCase().includes(q) ||
            (s.sector && s.sector.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortBy === 'price') {
          valA = a.price;
          valB = b.price;
        } else if (sortBy === 'change') {
          valA = a.change;
          valB = b.change;
        } else if (sortBy === 'changePercent') {
          valA = a.changePercent;
          valB = b.changePercent;
        } else {
          valA = a.symbol.localeCompare(b.symbol);
          valB = 0;
          return sortOrder === 'desc' ? -valA : valA;
        }
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [symbols, categoryFilter, ratingFilter, perfFilter, searchQuery, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    const headers = ['Symbol', 'Name', 'Category', 'Exchange', 'Price', 'Change', 'ChangePercent', 'TechnicalRating'];
    const rows = filteredSymbols.map((s) => [
      s.symbol,
      `"${s.name}"`,
      s.category,
      s.exchange,
      s.price,
      s.change,
      s.changePercent,
      s.technicalRating,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tradingview_screener_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsExporting(false), 1200);
  };

  return (
    <div className="space-y-4">
      {/* Screener Controls Bar */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#2962ff]" />
            <h2 className="font-bold text-white text-sm">Market Screener & Filter Engine</h2>
            <span className="text-xs text-[#787b86] font-mono">({filteredSymbols.length} results)</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Export CSV button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2a2e39] hover:bg-[#363a45] text-white text-xs font-medium border border-[#363a45] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#2962ff]" />
              <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {/* Multi-tier Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-[#2a2e39]">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#787b86] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticker, company..."
              className="w-full bg-[#131722] border border-[#2a2e39] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#787b86] outline-none focus:border-[#2962ff]"
            />
          </div>

          {/* Asset Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#131722] border border-[#2a2e39] text-[#d1d4dc] text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-[#2962ff]"
          >
            <option value="all">All Asset Classes</option>
            <option value="stock">Equities (Stocks)</option>
            <option value="crypto">Cryptocurrencies</option>
            <option value="forex">Forex (FX Pairs)</option>
            <option value="index">Indices</option>
            <option value="commodity">Commodities</option>
            <option value="bond">Bonds & Yields</option>
          </select>

          {/* Performance Filter */}
          <select
            value={perfFilter}
            onChange={(e) => setPerfFilter(e.target.value)}
            className="bg-[#131722] border border-[#2a2e39] text-[#d1d4dc] text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-[#2962ff]"
          >
            <option value="all">Any Performance</option>
            <option value="gainers">Gainers Only (+%)</option>
            <option value="losers">Losers Only (-%)</option>
            <option value="extreme">High Volatility (&gt; ±3%)</option>
          </select>

          {/* Technical Rating */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-[#131722] border border-[#2a2e39] text-[#d1d4dc] text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-[#2962ff]"
          >
            <option value="all">All Technical Ratings</option>
            <option value="Strong Buy">Strong Buy</option>
            <option value="Buy">Buy</option>
            <option value="Neutral">Neutral</option>
            <option value="Sell">Sell</option>
            <option value="Strong Sell">Strong Sell</option>
          </select>
        </div>
      </div>

      {/* Screener Data Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#131722] text-[#787b86] uppercase font-mono text-[10px] border-b border-[#2a2e39]">
              <tr>
                <th className="px-4 py-2.5 cursor-pointer" onClick={() => handleSort('symbol')}>
                  <div className="flex items-center gap-1">
                    <span>Symbol / Asset</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5 text-right cursor-pointer" onClick={() => handleSort('price')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-2.5 text-right cursor-pointer" onClick={() => handleSort('change')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Change</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-2.5 text-right cursor-pointer" onClick={() => handleSort('changePercent')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>% Change</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-2.5 text-right">Volume</th>
                <th className="px-4 py-2.5 text-center">Trend (24h)</th>
                <th className="px-4 py-2.5 text-right">Technical Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50 font-mono tabular-nums">
              {filteredSymbols.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-[#787b86]">
                    No instruments found matching the current screener filters.
                  </td>
                </tr>
              ) : (
                filteredSymbols.map((item) => {
                  const isPos = item.changePercent >= 0;
                  return (
                    <tr
                      key={item.symbol}
                      onClick={() => onSelectSymbol(item)}
                      className="hover:bg-[#252a37] transition-colors group cursor-pointer"
                    >
                      <td className="px-4 py-3 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                            {item.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86] truncate max-w-[160px]">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-sans capitalize text-[#9598a1]">
                        {item.category}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-white">
                        ${item.price > 1000 ? item.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : item.price.toFixed(item.price < 1 ? 4 : 2)}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isPos ? '+' : ''}{item.change.toFixed(2)}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        <div className="inline-flex items-center gap-0.5">
                          {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{isPos ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-[#d1d4dc]">
                        {item.volume}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          <Sparkline data={item.sparkline} isPositive={isPos} width={65} height={18} strokeWidth={1.5} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-sans">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.technicalRating.includes('Buy')
                            ? 'bg-[#089981]/15 text-[#089981]'
                            : item.technicalRating.includes('Sell')
                            ? 'bg-[#f23645]/15 text-[#f23645]'
                            : 'bg-[#2a2e39] text-[#787b86]'
                        }`}>
                          {item.technicalRating}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
