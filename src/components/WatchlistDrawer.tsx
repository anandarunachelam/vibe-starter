import React, { useState } from 'react';
import { SymbolData, EconomicEvent } from '../types/market';
import { Sparkline } from './Sparkline';
import { 
  X, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Bookmark, 
  Search,
  ExternalLink,
  Plus
} from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: SymbolData[];
  onRemoveFromWatchlist: (symbol: string) => void;
  onSelectSymbol: (symbol: SymbolData) => void;
  onOpenSearch: () => void;
  economicCalendar: EconomicEvent[];
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  onRemoveFromWatchlist,
  onSelectSymbol,
  onOpenSearch,
  economicCalendar,
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'calendar'>('watchlist');

  if (!isOpen) return null;

  return (
    <aside className="fixed top-0 right-0 bottom-0 z-40 w-80 sm:w-96 bg-[#1e222d] border-l border-[#2a2e39] shadow-2xl flex flex-col text-[#d1d4dc] animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2e39] bg-[#181b24]">
        <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'watchlist'
                ? 'bg-[#2962ff] text-white font-semibold'
                : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Watchlist ({watchlist.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-[#2962ff] text-white font-semibold'
                : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[#2a2e39] text-[#787b86] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body */}
      {activeTab === 'watchlist' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Add Symbol Bar */}
          <div className="p-3 border-b border-[#2a2e39] bg-[#131722]/50">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#2a2e39] hover:bg-[#2a2e39]/80 text-[#d1d4dc] hover:text-white text-xs font-medium rounded-lg border border-[#363a45] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#2962ff]" />
              <span>Add Symbol to Watchlist</span>
            </button>
          </div>

          {/* Watchlist Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/50">
            {watchlist.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#787b86]">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>Your watchlist is empty.</p>
                <p className="text-xs text-[#5d606b] mt-1">Click the bookmark icon on any symbol to add it here.</p>
              </div>
            ) : (
              watchlist.map((item) => {
                const isPos = item.changePercent >= 0;
                return (
                  <div
                    key={item.symbol}
                    className="flex items-center justify-between p-3 hover:bg-[#2a2e39]/40 group transition-colors"
                  >
                    <button
                      onClick={() => onSelectSymbol(item)}
                      className="flex-1 flex items-center justify-between text-left cursor-pointer pr-2"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm group-hover:text-[#2962ff] transition-colors">
                            {item.symbol}
                          </span>
                          <span className="text-[10px] text-[#787b86] font-mono">
                            {item.exchange}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#787b86] truncate max-w-[120px]">
                          {item.name}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Sparkline
                          data={item.sparkline}
                          isPositive={isPos}
                          width={44}
                          height={18}
                          strokeWidth={1.5}
                        />

                        <div className="text-right font-mono tabular-nums">
                          <div className="text-xs font-bold text-white">
                            ${item.price > 1000 ? item.price.toLocaleString() : item.price.toFixed(2)}
                          </div>
                          <div
                            className={`text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                              isPos ? 'text-[#089981]' : 'text-[#f23645]'
                            }`}
                          >
                            {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => onRemoveFromWatchlist(item.symbol)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-500/20 text-[#787b86] hover:text-rose-400 rounded transition-all cursor-pointer"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Economic Calendar Tab */
        <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/50">
          <div className="px-4 py-3 bg-[#131722]/50 text-xs text-[#787b86] border-b border-[#2a2e39]">
            Upcoming high-impact macroeconomic events and rate statements.
          </div>

          {economicCalendar.map((event) => (
            <div key={event.id} className="p-3.5 hover:bg-[#2a2e39]/30 transition-colors">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-[#787b86]">{event.time}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    event.impact === 'high'
                      ? 'bg-rose-500/20 text-rose-400'
                      : event.impact === 'medium'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-[#2a2e39] text-[#787b86]'
                  }`}
                >
                  {event.impact.toUpperCase()}
                </span>
              </div>

              <div className="font-semibold text-white text-xs mb-1">
                {event.country} · {event.event}
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono tabular-nums text-[#787b86] pt-1">
                <div>Act: <span className="text-[#d1d4dc]">{event.actual || '—'}</span></div>
                <div>Fcst: <span className="text-[#d1d4dc]">{event.forecast || '—'}</span></div>
                <div>Prev: <span className="text-[#d1d4dc]">{event.previous || '—'}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};
