import React, { useState, useMemo } from 'react';
import { SymbolData } from '../../types/market';
import { Sparkline } from '../Sparkline';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  Search, 
  Filter, 
  BarChart3,
  Check
} from 'lucide-react';

interface StocksScreenProps {
  stocks: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const StocksScreen: React.FC<StocksScreenProps> = ({
  stocks,
  onSelectSymbol,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Sector performance metrics
  const sectorPerformance = [
    { name: 'Technology', change: 2.14, color: '#089981' },
    { name: 'Communication', change: 1.62, color: '#089981' },
    { name: 'Financial', change: 1.28, color: '#089981' },
    { name: 'Consumer Cyclical', change: 0.94, color: '#089981' },
    { name: 'Industrials', change: 0.45, color: '#089981' },
    { name: 'Healthcare', change: -0.62, color: '#f23645' },
    { name: 'Energy', change: -1.18, color: '#f23645' },
    { name: 'Real Estate', change: -0.85, color: '#f23645' },
  ];

  const sectors = ['all', 'Technology', 'Communication', 'Consumer Cyclical', 'Financial', 'Healthcare', 'Energy'];

  const filteredStocks = useMemo(() => {
    return stocks
      .filter((s) => s.category === 'stock')
      .filter((s) => selectedSector === 'all' || s.sector === selectedSector)
      .filter((s) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortBy === 'price') {
          valA = a.price;
          valB = b.price;
        } else if (sortBy === 'changePercent') {
          valA = a.changePercent;
          valB = b.changePercent;
        } else if (sortBy === 'pe') {
          valA = a.pe || 0;
          valB = b.pe || 0;
        } else {
          // Market Cap approximation
          valA = a.marketCap?.includes('T') ? parseFloat(a.marketCap) * 1000 : parseFloat(a.marketCap || '0');
          valB = b.marketCap?.includes('T') ? parseFloat(b.marketCap) * 1000 : parseFloat(b.marketCap || '0');
        }
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [stocks, selectedSector, sortBy, sortOrder, searchQuery]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sector Performance Horizontal Strip */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#2962ff]" />
            <h2 className="font-bold text-white text-sm">US Sectors Daily Performance</h2>
          </div>
          <span className="text-[11px] text-[#787b86]">Standard & Poor's GICS Classification</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {sectorPerformance.map((sec) => (
            <button
              key={sec.name}
              onClick={() => setSelectedSector(selectedSector === sec.name ? 'all' : sec.name)}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                selectedSector === sec.name
                  ? 'bg-[#2962ff]/20 border-[#2962ff]'
                  : 'bg-[#131722] border-[#2a2e39] hover:border-[#383e4e]'
              }`}
            >
              <div className="text-[11px] text-[#9598a1] truncate mb-1">{sec.name}</div>
              <div
                className={`font-mono text-xs font-bold tabular-nums ${
                  sec.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {sec.change >= 0 ? '+' : ''}{sec.change.toFixed(2)}%
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stocks Table & Controls */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
        {/* Table Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[#2a2e39] bg-[#181b24]">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-white text-sm">US & Global Equities</h2>
            <span className="text-xs text-[#787b86] font-mono">({filteredStocks.length} symbols)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#787b86] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter stocks..."
                className="bg-[#131722] border border-[#2a2e39] rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-[#787b86] outline-none w-36 sm:w-48 focus:border-[#2962ff]"
              />
            </div>

            {/* Sector Dropdown / Buttons */}
            <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39] overflow-x-auto scrollbar-none">
              {sectors.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-2.5 py-1 rounded text-xs font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                    selectedSector === sec
                      ? 'bg-[#2962ff] text-white font-semibold'
                      : 'text-[#787b86] hover:text-[#d1d4dc]'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* High-density Stock Screener Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#131722] text-[#787b86] uppercase font-mono text-[10px] border-b border-[#2a2e39]">
              <tr>
                <th className="px-4 py-2.5 cursor-pointer" onClick={() => handleSort('symbol')}>
                  <div className="flex items-center gap-1">
                    <span>Company / Ticker</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-2.5 text-right cursor-pointer" onClick={() => handleSort('price')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-2.5 text-right cursor-pointer" onClick={() => handleSort('changePercent')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Change %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-2.5 text-right">Volume</th>
                <th className="px-4 py-2.5 text-right cursor-pointer" onClick={() => handleSort('marketCap')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Market Cap</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-2.5 text-right cursor-pointer" onClick={() => handleSort('pe')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>P/E Ratio</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-2.5 text-center">Trend</th>
                <th className="px-4 py-2.5 text-right">Technical Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50 font-mono tabular-nums">
              {filteredStocks.map((stock) => {
                const isPos = stock.changePercent >= 0;
                return (
                  <tr
                    key={stock.symbol}
                    onClick={() => onSelectSymbol(stock)}
                    className="hover:bg-[#252a37] transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-xs text-[#2962ff]">
                          {stock.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                            {stock.symbol}
                          </div>
                          <div className="text-[11px] text-[#787b86] font-sans truncate max-w-[140px] sm:max-w-xs">
                            {stock.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-white">
                      ${stock.price.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      <div className="inline-flex items-center gap-0.5">
                        {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-[#d1d4dc]">
                      {stock.volume}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-white">
                      {stock.marketCap || '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-[#9598a1]">
                      {stock.pe ? `${stock.pe}x` : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <Sparkline data={stock.sparkline} isPositive={isPos} width={65} height={18} strokeWidth={1.5} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        stock.technicalRating.includes('Buy')
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : stock.technicalRating.includes('Sell')
                          ? 'bg-[#f23645]/15 text-[#f23645]'
                          : 'bg-[#2a2e39] text-[#787b86]'
                      }`}>
                        {stock.technicalRating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
