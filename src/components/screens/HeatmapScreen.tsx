import React, { useState, useMemo } from 'react';
import { TreemapNode, SymbolData } from '../../types/market';
import { Layers, Coins, TrendingUp, TrendingDown, Info, Sliders } from 'lucide-react';

interface HeatmapScreenProps {
  sp500Data: TreemapNode[];
  cryptoData: TreemapNode[];
  symbols: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const HeatmapScreen: React.FC<HeatmapScreenProps> = ({
  sp500Data,
  cryptoData,
  symbols,
  onSelectSymbol,
}) => {
  const [heatmapType, setHeatmapType] = useState<'stocks' | 'crypto'>('stocks');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<TreemapNode | null>(null);

  const rawData = heatmapType === 'stocks' ? sp500Data : cryptoData;

  const sectors = useMemo(() => {
    const list = Array.from(new Set(rawData.map((d) => d.sector)));
    return ['all', ...list];
  }, [rawData]);

  const filteredData = useMemo(() => {
    if (selectedSector === 'all') return rawData;
    return rawData.filter((d) => d.sector === selectedSector);
  }, [rawData, selectedSector]);

  // Group by sector for tree layout representation
  const groupedBySector = useMemo(() => {
    const map: Record<string, TreemapNode[]> = {};
    filteredData.forEach((item) => {
      if (!map[item.sector]) map[item.sector] = [];
      map[item.sector].push(item);
    });
    return map;
  }, [filteredData]);

  // Color generator based on change %
  const getPerformanceColor = (pct: number) => {
    if (pct >= 4.0) return 'bg-[#089981] text-white border-emerald-400';
    if (pct >= 2.0) return 'bg-[#089981]/90 text-white border-emerald-500';
    if (pct >= 0.5) return 'bg-[#089981]/75 text-white border-emerald-600';
    if (pct >= 0.0) return 'bg-[#089981]/50 text-emerald-100 border-emerald-700';
    if (pct > -1.5) return 'bg-[#f23645]/60 text-rose-100 border-rose-700';
    if (pct > -3.0) return 'bg-[#f23645]/85 text-white border-rose-500';
    return 'bg-[#f23645] text-white border-rose-400';
  };

  const handleNodeClick = (node: TreemapNode) => {
    const match = symbols.find(
      (s) => s.symbol === node.symbol || s.symbol.startsWith(node.symbol)
    );
    if (match) {
      onSelectSymbol(match);
    }
  };

  return (
    <div className="space-y-4">
      {/* Heatmap Controls Bar */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
            <button
              onClick={() => {
                setHeatmapType('stocks');
                setSelectedSector('all');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                heatmapType === 'stocks'
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>S&P 500 Stocks</span>
            </button>
            <button
              onClick={() => {
                setHeatmapType('crypto');
                setSelectedSector('all');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                heatmapType === 'crypto'
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Cryptocurrencies</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#787b86]">
            <span>Sized by: <strong className="text-white">Market Capitalization</strong></span>
            <span>·</span>
            <span>Color: <strong className="text-white">1-Day Change %</strong></span>
          </div>
        </div>

        {/* Sector Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 rounded text-xs capitalize whitespace-nowrap transition-colors cursor-pointer ${
                selectedSector === sec
                  ? 'bg-[#2a2e39] text-white font-bold border border-[#363a45]'
                  : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#131722]'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Treemap Canvas Container */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 shadow-sm min-h-[520px] flex flex-col justify-between relative">
        {/* Heatmap Legend */}
        <div className="flex items-center justify-between text-xs text-[#787b86] mb-3 pb-2 border-b border-[#2a2e39]">
          <div className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>Click any box to inspect full interactive chart and financials</span>
          </div>

          {/* Color Scale Bar */}
          <div className="flex items-center gap-1 text-[10px] font-mono">
            <span>-3%</span>
            <div className="flex h-2.5 w-32 rounded overflow-hidden">
              <span className="flex-1 bg-[#f23645]"></span>
              <span className="flex-1 bg-[#f23645]/70"></span>
              <span className="flex-1 bg-[#2a2e39]"></span>
              <span className="flex-1 bg-[#089981]/70"></span>
              <span className="flex-1 bg-[#089981]"></span>
            </div>
            <span>+3%</span>
          </div>
        </div>

        {/* Treemap Sectors Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
          {Object.entries(groupedBySector).map(([sectorName, items]) => (
            <div
              key={sectorName}
              className="bg-[#131722]/80 border border-[#2a2e39] rounded-lg p-2.5 flex flex-col"
            >
              <div className="text-[11px] font-bold text-[#9598a1] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{sectorName}</span>
                <span className="text-[10px] text-[#787b86] font-mono">{items.length} items</span>
              </div>

              {/* Dynamic Grid inside each sector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 flex-1 content-start">
                {items.map((node) => {
                  const isPos = node.changePercent >= 0;
                  const colorClass = getPerformanceColor(node.changePercent);
                  // Scale flex size based on market cap
                  const isMega = node.marketCap > 1000;
                  const isLarge = node.marketCap > 300;

                  return (
                    <button
                      key={node.symbol}
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`${colorClass} ${
                        isMega ? 'col-span-2 row-span-2 min-h-[100px]' : isLarge ? 'min-h-[75px]' : 'min-h-[60px]'
                      } p-2 rounded-md transition-all hover:scale-[1.02] hover:z-10 text-left flex flex-col justify-between shadow-sm cursor-pointer border`}
                    >
                      <div>
                        <div className={`font-black tracking-tight ${isMega ? 'text-lg' : 'text-sm'}`}>
                          {node.symbol}
                        </div>
                        <div className="text-[10px] opacity-85 truncate">
                          {node.name}
                        </div>
                      </div>

                      <div className="font-mono font-bold tabular-nums text-xs">
                        {isPos ? '+' : ''}{node.changePercent.toFixed(2)}%
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Hover Readout Bar */}
        <div className="mt-4 pt-3 border-t border-[#2a2e39] flex flex-wrap items-center justify-between text-xs font-mono text-[#787b86]">
          {hoveredNode ? (
            <div className="flex items-center gap-4 text-white">
              <span>SYMBOL: <strong className="text-[#2962ff]">{hoveredNode.symbol}</strong></span>
              <span>NAME: <strong>{hoveredNode.name}</strong></span>
              <span>PRICE: <strong>${hoveredNode.price > 1000 ? hoveredNode.price.toLocaleString() : hoveredNode.price.toFixed(2)}</strong></span>
              <span>CHANGE: <strong className={hoveredNode.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}>{hoveredNode.changePercent >= 0 ? '+' : ''}{hoveredNode.changePercent}%</strong></span>
              <span>CAP: <strong>${hoveredNode.marketCap}B</strong></span>
            </div>
          ) : (
            <span>Hover over any tile for instant asset valuation and metrics</span>
          )}
        </div>
      </div>
    </div>
  );
};
