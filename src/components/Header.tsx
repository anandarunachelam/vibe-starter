import React from 'react';
import { MarketTab } from '../types/market';
import { 
  Search, 
  Bookmark, 
  Sun, 
  Moon, 
  BarChart3, 
  Globe, 
  Layers, 
  Filter, 
  Newspaper,
  Coins,
  TrendingUp,
  CircleDollarSign,
  Fuel,
  Clock
} from 'lucide-react';

interface HeaderProps {
  currentTab: MarketTab;
  onSelectTab: (tab: MarketTab) => void;
  onOpenSearch: () => void;
  onToggleWatchlist: () => void;
  watchlistCount: number;
  isWatchlistOpen: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  onToggleWatchlist,
  watchlistCount,
  isWatchlistOpen,
  isDarkMode,
  onToggleTheme,
}) => {
  const navTabs: { id: MarketTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'stocks', label: 'Stocks', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'crypto', label: 'Crypto', icon: <Coins className="w-3.5 h-3.5" /> },
    { id: 'forex', label: 'Forex', icon: <CircleDollarSign className="w-3.5 h-3.5" /> },
    { id: 'indices', label: 'Indices', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'futures', label: 'Futures & Commodities', icon: <Fuel className="w-3.5 h-3.5" /> },
    { id: 'bonds', label: 'Bonds', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'heatmap', label: 'Heatmap', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'screener', label: 'Screener', icon: <Filter className="w-3.5 h-3.5" /> },
    { id: 'news', label: 'News', icon: <Newspaper className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#131722] dark:bg-[#131722] border-b border-[#2a2e39] dark:border-[#2a2e39]">
      {/* Upper Navigation Row */}
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            {/* TradingView Iconic Vector Mark */}
            <div className="w-7 h-7 bg-[#2962ff] rounded flex items-center justify-center text-white font-black text-xs tracking-tighter shadow-sm group-hover:bg-[#1e53e5] transition-colors">
              <svg viewBox="0 0 28 28" className="w-5 h-5 fill-current">
                <rect x="3" y="11" width="4.5" height="12" rx="1.5" />
                <rect x="10.5" y="5" width="4.5" height="18" rx="1.5" />
                <rect x="18" y="15" width="4.5" height="8" rx="1.5" />
              </svg>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base lg:text-lg tracking-tight text-white">
                TradingView
              </span>
              <span className="text-xs font-semibold text-[#787b86] uppercase tracking-wider">
                Markets
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {navTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#2a2e39] text-white shadow-sm font-semibold'
                    : 'text-[#9598a1] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Symbol Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc] px-3 py-1.5 rounded-lg border border-[#2a2e39] text-xs transition-colors cursor-pointer"
            title="Search symbols, indices, commodities (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#9598a1]" />
            <span className="hidden sm:inline text-xs text-[#9598a1]">Search markets...</span>
            <kbd className="hidden md:inline-flex items-center text-[10px] font-mono px-1 py-0.2 bg-[#131722] text-[#787b86] rounded border border-[#2a2e39]">
              ⌘K
            </kbd>
          </button>

          {/* Market Status pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 text-[11px] text-[#089981] font-mono bg-[#089981]/10 rounded border border-[#089981]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981]"></span>
            <span>NYSE / NASDAQ OPEN</span>
          </div>

          {/* Watchlist Drawer Button */}
          <button
            onClick={onToggleWatchlist}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isWatchlistOpen
                ? 'bg-[#2962ff] text-white border-[#2962ff]'
                : 'bg-[#1e222d] text-[#d1d4dc] hover:bg-[#2a2e39] border-[#2a2e39]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center font-mono">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Light/Dark Mode toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-[#1e222d] hover:bg-[#2a2e39] border border-[#2a2e39] text-[#9598a1] hover:text-white transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Category Subnav */}
      <div className="xl:hidden px-4 py-2 border-t border-[#2a2e39] overflow-x-auto scrollbar-none flex items-center gap-1.5">
        {navTabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'text-[#9598a1] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
