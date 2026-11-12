import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SymbolData, AssetCategory } from '../types/market';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface SymbolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const SymbolSearchModal: React.FC<SymbolSearchModalProps> = ({
  isOpen,
  onClose,
  symbols,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'stock', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'index', label: 'Indices' },
    { id: 'commodity', label: 'Commodities' },
    { id: 'bond', label: 'Bonds' },
  ];

  const filteredSymbols = useMemo(() => {
    return symbols.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = query.toLowerCase().trim();
      if (!q) return matchesCategory;
      const matchesText =
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.exchange.toLowerCase().includes(q) ||
        (item.sector && item.sector.toLowerCase().includes(q));
      return matchesCategory && matchesText;
    });
  }, [symbols, query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="bg-[#1e222d] border border-[#2a2e39] text-[#d1d4dc] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Field */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#2a2e39] bg-[#181b24]">
          <Search className="w-5 h-5 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, index, or cryptocurrency..."
            className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-[#787b86]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#787b86] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded bg-[#2a2e39] text-[#9598a1] hover:text-white text-xs font-mono px-2 py-0.5"
          >
            ESC
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-[#2a2e39] bg-[#131722] overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#2a2e39]/60">
          {filteredSymbols.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#787b86]">
              No instruments found matching <span className="text-white">"{query}"</span>
            </div>
          ) : (
            filteredSymbols.map((item) => {
              const isPos = item.changePercent >= 0;
              return (
                <button
                  key={item.symbol}
                  onClick={() => {
                    onSelectSymbol(item);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#2a2e39]/50 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-xs text-[#2962ff] group-hover:border-[#2962ff] transition-colors">
                      {item.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.symbol}</span>
                        <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-[#131722] text-[#787b86]">
                          {item.exchange}
                        </span>
                      </div>
                      <div className="text-xs text-[#787b86] truncate max-w-xs sm:max-w-md">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono tabular-nums">
                    <div className="text-sm font-semibold text-white">
                      ${item.price > 1000 ? item.price.toLocaleString() : item.price.toFixed(item.price < 1 ? 4 : 2)}
                    </div>
                    <div
                      className={`text-xs font-medium flex items-center justify-end gap-0.5 ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#181b24] border-t border-[#2a2e39] text-[11px] text-[#787b86] flex items-center justify-between">
          <span>Search symbols, companies, or currencies</span>
          <span className="flex items-center gap-1">
            Press <kbd className="px-1 py-0.5 bg-[#131722] border border-[#2a2e39] rounded text-[10px]">↵</kbd> to view chart
          </span>
        </div>
      </div>
    </div>
  );
};
