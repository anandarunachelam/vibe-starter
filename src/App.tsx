/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MarketTab, SymbolData, NewsArticle, EconomicEvent, TreemapNode } from './types/market';
import { 
  INITIAL_SYMBOLS, 
  S_P_500_HEATMAP, 
  CRYPTO_HEATMAP, 
  NEWS_ARTICLES, 
  ECONOMIC_CALENDAR, 
  CURRENCY_CROSS_RATES 
} from './data/mockMarketData';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { ProChartModal } from './components/ProChartModal';
import { SymbolSearchModal } from './components/SymbolSearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';

// Screens
import { OverviewScreen } from './components/screens/OverviewScreen';
import { StocksScreen } from './components/screens/StocksScreen';
import { CryptoScreen } from './components/screens/CryptoScreen';
import { ForexScreen } from './components/screens/ForexScreen';
import { IndicesScreen } from './components/screens/IndicesScreen';
import { FuturesScreen } from './components/screens/FuturesScreen';
import { BondsScreen } from './components/screens/BondsScreen';
import { HeatmapScreen } from './components/screens/HeatmapScreen';
import { ScreenerScreen } from './components/screens/ScreenerScreen';
import { NewsScreen } from './components/screens/NewsScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<MarketTab>('overview');
  const [symbols, setSymbols] = useState<SymbolData[]>(INITIAL_SYMBOLS);
  const [flashingSymbols, setFlashingSymbols] = useState<Record<string, 'up' | 'down'>>({});
  
  // Watchlist state preloaded with key assets
  const [watchlist, setWatchlist] = useState<SymbolData[]>(() => {
    return INITIAL_SYMBOLS.filter((s) => ['SPX', 'NDX', 'NVDA', 'BTCUSDT', 'XAUUSD', 'TSLA'].includes(s.symbol));
  });

  const [selectedChartSymbol, setSelectedChartSymbol] = useState<SymbolData | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Real-time market tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick 1-2 random symbols to tick
      const randomIndices = [
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
      ];

      setSymbols((prev) => {
        const next = [...prev];
        const newFlashes: Record<string, 'up' | 'down'> = {};

        randomIndices.forEach((idx) => {
          const target = next[idx];
          if (!target) return;

          // Tiny tick: between -0.15% and +0.15%
          const pctDelta = (Math.random() - 0.49) * 0.003;
          const oldPrice = target.price;
          const newPrice = Number((oldPrice * (1 + pctDelta)).toFixed(target.price < 1 ? 4 : 2));
          const isUp = newPrice >= oldPrice;
          const priceDiff = newPrice - (target.fundamentals?.prevClose || oldPrice);
          const newChangePct = ((newPrice - (target.fundamentals?.prevClose || oldPrice)) / (target.fundamentals?.prevClose || oldPrice)) * 100;

          // Update sparkline
          const newSparkline = [...target.sparkline.slice(1), newPrice];

          next[idx] = {
            ...target,
            price: newPrice,
            change: Number(priceDiff.toFixed(2)),
            changePercent: Number(newChangePct.toFixed(2)),
            high24h: Math.max(target.high24h, newPrice),
            low24h: Math.min(target.low24h, newPrice),
            sparkline: newSparkline,
          };

          newFlashes[target.symbol] = isUp ? 'up' : 'down';
        });

        setFlashingSymbols(newFlashes);
        setTimeout(() => setFlashingSymbols({}), 850);

        return next;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [symbols.length]);

  // Keep watchlist prices synced with live symbols
  useEffect(() => {
    setWatchlist((prevW) => {
      return prevW.map((item) => {
        const live = symbols.find((s) => s.symbol === item.symbol);
        return live || item;
      });
    });
  }, [symbols]);

  const handleToggleWatchlist = (symbol: SymbolData) => {
    setWatchlist((prev) => {
      const exists = prev.some((s) => s.symbol === symbol.symbol);
      if (exists) {
        return prev.filter((s) => s.symbol !== symbol.symbol);
      } else {
        return [...prev, symbol];
      }
    });
  };

  const handleRemoveFromWatchlist = (symbolStr: string) => {
    setWatchlist((prev) => prev.filter((s) => s.symbol !== symbolStr));
  };

  const isSelectedWatchlisted = selectedChartSymbol
    ? watchlist.some((s) => s.symbol === selectedChartSymbol.symbol)
    : false;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-[#f0f3fa] text-[#131722]'} font-sans flex flex-col`}>
      {/* 1. Top Ticker Tape Stream */}
      <TickerTape
        symbols={symbols}
        onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
        flashingSymbols={flashingSymbols}
      />

      {/* 2. Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleWatchlist={() => setIsWatchlistOpen(!isWatchlistOpen)}
        watchlistCount={watchlist.length}
        isWatchlistOpen={isWatchlistOpen}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* 3. Main Workspace Canvas */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 lg:px-6 py-6">
        {currentTab === 'overview' && (
          <OverviewScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            heatmapData={S_P_500_HEATMAP}
            newsArticles={NEWS_ARTICLES}
            currencyCrossRates={CURRENCY_CROSS_RATES}
          />
        )}

        {currentTab === 'stocks' && (
          <StocksScreen
            stocks={symbols}
            onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
          />
        )}

        {currentTab === 'crypto' && (
          <CryptoScreen
            cryptoSymbols={symbols}
            onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
          />
        )}

        {currentTab === 'forex' && (
          <ForexScreen
            forexSymbols={symbols}
            onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
            crossRates={CURRENCY_CROSS_RATES}
          />
        )}

        {currentTab === 'indices' && (
          <IndicesScreen
            indices={symbols}
            onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
          />
        )}

        {currentTab === 'futures' && (
          <FuturesScreen
            futuresSymbols={symbols}
            onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
          />
        )}

        {currentTab === 'bonds' && (
          <BondsScreen
            bondSymbols={symbols}
            onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
          />
        )}

        {currentTab === 'heatmap' && (
          <HeatmapScreen
            sp500Data={S_P_500_HEATMAP}
            cryptoData={CRYPTO_HEATMAP}
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
          />
        )}

        {currentTab === 'screener' && (
          <ScreenerScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
          />
        )}

        {currentTab === 'news' && (
          <NewsScreen
            articles={NEWS_ARTICLES}
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
          />
        )}
      </main>

      {/* 4. Pro Chart Modal */}
      <ProChartModal
        symbol={selectedChartSymbol}
        onClose={() => setSelectedChartSymbol(null)}
        isWatchlisted={isSelectedWatchlisted}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* 5. Symbol Search Modal */}
      <SymbolSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        symbols={symbols}
        onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
      />

      {/* 6. Right Side Watchlist & Calendar Dock */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
        onOpenSearch={() => setIsSearchOpen(true)}
        economicCalendar={ECONOMIC_CALENDAR}
      />

      {/* 7. Quiet Professional Footer */}
      <footer className="mt-auto border-t border-[#2a2e39] bg-[#131722] py-4 text-xs text-[#787b86]">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#d1d4dc]">TradingView Markets</span>
            <span>·</span>
            <span>Real-time Financial Markets Overview</span>
            <span>·</span>
            <span>Market quotes delayed by 15 mins for non-realtime venues</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>UTC {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</span>
            <span>·</span>
            <span className="text-[#089981]">Exchange Feeds Connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
