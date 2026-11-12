import React, { useState, useMemo, useRef } from 'react';
import { SymbolData, CandleData } from '../types/market';
import { generateCandleHistory } from '../data/mockMarketData';
import { 
  X, 
  Bookmark, 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  Activity, 
  Clock, 
  Maximize2, 
  Share2,
  CheckCircle2,
  Sliders,
  DollarSign
} from 'lucide-react';

interface ProChartModalProps {
  symbol: SymbolData | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: SymbolData) => void;
}

type ChartType = 'candles' | 'area' | 'line' | 'bars';
type Timeframe = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | 'ALL';

export const ProChartModal: React.FC<ProChartModalProps> = ({
  symbol,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('candles');
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  
  // Interactive Crosshair state
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Paper trading order state
  const [orderNotification, setOrderNotification] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate dynamic candles based on selected timeframe
  const candles: CandleData[] = useMemo(() => {
    if (!symbol) return [];
    return generateCandleHistory(
      symbol.price, 
      timeframe, 
      symbol.changePercent >= 0 ? 0.0015 : -0.0015
    );
  }, [symbol, timeframe]);

  // Compute Moving Averages
  const ma20Data = useMemo(() => {
    return candles.map((_, idx, arr) => {
      if (idx < 5) return null;
      const window = arr.slice(Math.max(0, idx - 10), idx + 1);
      const sum = window.reduce((a, b) => a + b.close, 0);
      return sum / window.length;
    });
  }, [candles]);

  const ma50Data = useMemo(() => {
    return candles.map((_, idx, arr) => {
      if (idx < 12) return null;
      const window = arr.slice(Math.max(0, idx - 20), idx + 1);
      const sum = window.reduce((a, b) => a + b.close, 0);
      return sum / window.length;
    });
  }, [candles]);

  // Compute RSI (14) simulation
  const rsiData = useMemo(() => {
    return candles.map((c, idx) => {
      // smooth wave simulation bounded between 25 and 85
      const wave = Math.sin(idx * 0.35) * 18 + 52 + (symbol?.changePercent || 0) * 2;
      return Math.min(88, Math.max(22, Number(wave.toFixed(1))));
    });
  }, [candles, symbol]);

  if (!symbol) return null;

  const isPos = symbol.changePercent >= 0;

  // Active candle to display (either hovered candle or latest)
  const activeCandle = hoverIndex !== null && candles[hoverIndex] 
    ? candles[hoverIndex] 
    : candles[candles.length - 1] || {
        open: symbol.price,
        high: symbol.high24h,
        low: symbol.low24h,
        close: symbol.price,
        volume: 2450000,
        time: 'Live'
      };

  // Dimensions for Chart Area
  const chartHeight = 360;
  const rsiHeight = showRSI ? 80 : 0;
  const totalSvgHeight = chartHeight + rsiHeight;
  const chartWidth = 760;

  // Min and Max prices for scaling
  const allPrices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...allPrices) * 0.996;
  const maxPrice = Math.max(...allPrices) * 1.004;
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...candles.map(c => c.volume)) || 1;

  const candleSpacing = chartWidth / candles.length;
  const candleBodyWidth = Math.max(3, candleSpacing * 0.65);

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / priceRange) * (chartHeight - 30) - 20;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Scale to viewBox coordinates
    const scaleX = chartWidth / rect.width;
    const scaleY = totalSvgHeight / rect.height;
    const viewX = x * scaleX;
    const viewY = y * scaleY;

    setMousePos({ x: viewX, y: viewY });

    const idx = Math.floor(viewX / candleSpacing);
    if (idx >= 0 && idx < candles.length) {
      setHoverIndex(idx);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setMousePos(null);
  };

  const handleOrder = (type: 'BUY' | 'SELL') => {
    setOrderNotification(`Simulated ${type} order filled for 10 units of ${symbol.symbol} at $${symbol.price}`);
    setTimeout(() => setOrderNotification(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div 
        ref={containerRef}
        className="bg-[#1e222d] dark:bg-[#1e222d] border border-[#2a2e39] text-[#d1d4dc] rounded-xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]"
      >
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b border-[#2a2e39] bg-[#181b24]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#2962ff]/10 border border-[#2962ff]/30 text-[#2962ff] flex items-center justify-center font-bold text-sm">
              {symbol.symbol.slice(0, 2)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">{symbol.symbol}</span>
                <span className="text-xs text-[#787b86] font-medium hidden sm:inline">{symbol.name}</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#9598a1]">
                  {symbol.exchange}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  symbol.technicalRating.includes('Buy') 
                    ? 'bg-[#089981]/20 text-[#089981]' 
                    : symbol.technicalRating.includes('Sell') 
                    ? 'bg-[#f23645]/20 text-[#f23645]' 
                    : 'bg-[#2a2e39] text-[#d1d4dc]'
                }`}>
                  {symbol.technicalRating}
                </span>
              </div>
            </div>
          </div>

          {/* Price Header Readout */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                {symbol.currency === '%' ? '' : symbol.category === 'forex' ? '' : '$'}
                {symbol.price > 1000
                  ? symbol.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : symbol.price.toFixed(symbol.price < 1 ? 4 : 2)}
                {symbol.currency === '%' ? '%' : ''}
              </div>
              <div className={`flex items-center justify-end gap-1 text-xs font-mono font-medium ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{isPos ? '+' : ''}{symbol.change.toFixed(2)}</span>
                <span>({isPos ? '+' : ''}{symbol.changePercent.toFixed(2)}%)</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 border-l border-[#2a2e39] pl-3">
              <button
                onClick={() => onToggleWatchlist(symbol)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isWatchlisted
                    ? 'bg-[#2962ff] text-white border-[#2962ff]'
                    : 'bg-[#1e222d] text-[#9598a1] hover:text-white border-[#2a2e39]'
                }`}
                title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-white border border-[#2a2e39] transition-colors cursor-pointer"
                title="Close chart modal (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chart Toolbar Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-b border-[#2a2e39] bg-[#131722] text-xs">
          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-[#1e222d] p-0.5 rounded-lg border border-[#2a2e39]">
            {(['1D', '5D', '1M', '6M', 'YTD', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'text-[#9598a1] hover:text-[#d1d4dc] hover:bg-[#2a2e39]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style Selector */}
          <div className="flex items-center gap-1 bg-[#1e222d] p-0.5 rounded-lg border border-[#2a2e39]">
            <button
              onClick={() => setChartType('candles')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                chartType === 'candles' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                chartType === 'area' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                chartType === 'line' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Line
            </button>
          </div>

          {/* Indicators Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMA20(!showMA20)}
              className={`px-2 py-1 rounded border text-[11px] font-mono transition-colors cursor-pointer ${
                showMA20
                  ? 'bg-[#2962ff]/20 text-[#2962ff] border-[#2962ff]/40'
                  : 'bg-transparent text-[#787b86] border-[#2a2e39]'
              }`}
            >
              MA 20
            </button>
            <button
              onClick={() => setShowMA50(!showMA50)}
              className={`px-2 py-1 rounded border text-[11px] font-mono transition-colors cursor-pointer ${
                showMA50
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-transparent text-[#787b86] border-[#2a2e39]'
              }`}
            >
              MA 50
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-1 rounded border text-[11px] font-mono transition-colors cursor-pointer ${
                showRSI
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                  : 'bg-transparent text-[#787b86] border-[#2a2e39]'
              }`}
            >
              RSI (14)
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-1 rounded border text-[11px] font-mono transition-colors cursor-pointer ${
                showVolume
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-transparent text-[#787b86] border-[#2a2e39]'
              }`}
            >
              Volume
            </button>
          </div>

          {/* Quick Simulation Order Buttons */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => handleOrder('BUY')}
              className="px-3 py-1 bg-[#089981] hover:bg-[#067a67] text-white font-bold rounded text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <DollarSign className="w-3 h-3" />
              BUY
            </button>
            <button
              onClick={() => handleOrder('SELL')}
              className="px-3 py-1 bg-[#f23645] hover:bg-[#c22b37] text-white font-bold rounded text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
            >
              SELL
            </button>
          </div>
        </div>

        {/* OHLCV Dynamic Crosshair Readout Bar */}
        <div className="flex items-center flex-wrap gap-4 px-4 py-1.5 bg-[#131722] border-b border-[#2a2e39] text-[11px] font-mono tabular-nums text-[#787b86]">
          <span>
            TIME: <strong className="text-[#d1d4dc]">{activeCandle.time}</strong>
          </span>
          <span>
            OPEN: <strong className="text-[#d1d4dc]">{activeCandle.open.toFixed(2)}</strong>
          </span>
          <span>
            HIGH: <strong className="text-[#089981]">{activeCandle.high.toFixed(2)}</strong>
          </span>
          <span>
            LOW: <strong className="text-[#f23645]">{activeCandle.low.toFixed(2)}</strong>
          </span>
          <span>
            CLOSE: <strong className={activeCandle.close >= activeCandle.open ? 'text-[#089981]' : 'text-[#f23645]'}>{activeCandle.close.toFixed(2)}</strong>
          </span>
          {showVolume && (
            <span>
              VOL: <strong className="text-[#d1d4dc]">{(activeCandle.volume / 1000000).toFixed(2)}M</strong>
            </span>
          )}
          {showMA20 && (
            <span className="text-[#2962ff]">
              MA20: <strong>{(symbol.price * 0.992).toFixed(2)}</strong>
            </span>
          )}
          {showMA50 && (
            <span className="text-amber-400">
              MA50: <strong>{(symbol.price * 0.981).toFixed(2)}</strong>
            </span>
          )}
        </div>

        {/* Main Chart Canvas Viewport */}
        <div className="relative bg-[#131722] flex-1 min-h-[380px] p-2 overflow-hidden select-none">
          {orderNotification && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-[#1e222d] border border-emerald-500/50 text-white px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-2 shadow-xl animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{orderNotification}</span>
            </div>
          )}

          <svg
            viewBox={`0 0 ${chartWidth} ${totalSvgHeight}`}
            className="w-full h-full cursor-crosshair overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2962ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines Horizontal */}
            {[0.2, 0.4, 0.6, 0.8].map((pct, i) => {
              const y = chartHeight * pct;
              const priceVal = maxPrice - (pct * priceRange);
              return (
                <g key={`grid-${i}`}>
                  <line
                    x1="0"
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="#2a2e39"
                    strokeDasharray="3 3"
                    strokeWidth="0.75"
                  />
                  <text
                    x={chartWidth - 4}
                    y={y - 4}
                    fill="#5d606b"
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    textAnchor="end"
                  >
                    {priceVal.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Volume Bars */}
            {showVolume &&
              candles.map((c, idx) => {
                const x = idx * candleSpacing + candleSpacing / 2;
                const volHeight = (c.volume / maxVolume) * 60;
                const isGreen = c.close >= c.open;
                return (
                  <rect
                    key={`vol-${idx}`}
                    x={x - candleBodyWidth / 2}
                    y={chartHeight - volHeight - 5}
                    width={candleBodyWidth}
                    height={volHeight}
                    fill={isGreen ? '#089981' : '#f23645'}
                    opacity="0.28"
                  />
                );
              })}

            {/* Chart Rendering Mode */}
            {chartType === 'area' && (
              <g>
                {/* Area Gradient */}
                {(() => {
                  const pts = candles.map((c, idx) => {
                    const x = idx * candleSpacing + candleSpacing / 2;
                    const y = getY(c.close);
                    return `${x},${y}`;
                  });
                  const areaPath = `M ${pts[0]} L ${pts.join(' L ')} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;
                  const linePath = `M ${pts[0]} L ${pts.join(' L ')}`;
                  return (
                    <>
                      <path d={areaPath} fill="url(#areaGrad)" />
                      <path d={linePath} fill="none" stroke="#2962ff" strokeWidth="2" />
                    </>
                  );
                })()}
              </g>
            )}

            {chartType === 'line' && (
              <g>
                {(() => {
                  const pts = candles.map((c, idx) => {
                    const x = idx * candleSpacing + candleSpacing / 2;
                    const y = getY(c.close);
                    return `${x},${y}`;
                  });
                  const linePath = `M ${pts[0]} L ${pts.join(' L ')}`;
                  return (
                    <path
                      d={linePath}
                      fill="none"
                      stroke={isPos ? '#089981' : '#f23645'}
                      strokeWidth="2"
                    />
                  );
                })()}
              </g>
            )}

            {chartType === 'candles' &&
              candles.map((c, idx) => {
                const x = idx * candleSpacing + candleSpacing / 2;
                const openY = getY(c.open);
                const closeY = getY(c.close);
                const highY = getY(c.high);
                const lowY = getY(c.low);

                const isGreen = c.close >= c.open;
                const color = isGreen ? '#089981' : '#f23645';

                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.max(2, Math.abs(closeY - openY));

                return (
                  <g key={`candle-${idx}`}>
                    {/* Wick */}
                    <line
                      x1={x}
                      y1={highY}
                      x2={x}
                      y2={lowY}
                      stroke={color}
                      strokeWidth="1.2"
                    />
                    {/* Candle Body */}
                    <rect
                      x={x - candleBodyWidth / 2}
                      y={bodyTop}
                      width={candleBodyWidth}
                      height={bodyHeight}
                      fill={color}
                      rx="0.5"
                    />
                  </g>
                );
              })}

            {/* Moving Average 20 line */}
            {showMA20 && (() => {
              const pts = ma20Data
                .map((val, idx) => {
                  if (val === null) return null;
                  const x = idx * candleSpacing + candleSpacing / 2;
                  return `${x},${getY(val)}`;
                })
                .filter(Boolean);
              if (pts.length < 2) return null;
              return (
                <path
                  d={`M ${pts.join(' L ')}`}
                  fill="none"
                  stroke="#2962ff"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
              );
            })()}

            {/* Moving Average 50 line */}
            {showMA50 && (() => {
              const pts = ma50Data
                .map((val, idx) => {
                  if (val === null) return null;
                  const x = idx * candleSpacing + candleSpacing / 2;
                  return `${x},${getY(val)}`;
                })
                .filter(Boolean);
              if (pts.length < 2) return null;
              return (
                <path
                  d={`M ${pts.join(' L ')}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
              );
            })()}

            {/* RSI Sub-chart */}
            {showRSI && (
              <g transform={`translate(0, ${chartHeight})`}>
                <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#2a2e39" strokeWidth="1" />
                {/* 70 Overbought & 30 Oversold */}
                <line x1="0" y1={rsiHeight * 0.3} x2={chartWidth} y2={rsiHeight * 0.3} stroke="#9333ea" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
                <line x1="0" y1={rsiHeight * 0.7} x2={chartWidth} y2={rsiHeight * 0.7} stroke="#9333ea" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
                <text x="6" y="14" fill="#a855f7" fontSize="9" fontFamily="JetBrains Mono">
                  RSI 14 ({rsiData[hoverIndex !== null ? hoverIndex : rsiData.length - 1]})
                </text>
                <text x={chartWidth - 4} y={rsiHeight * 0.3 - 2} fill="#787b86" fontSize="8" textAnchor="end">70</text>
                <text x={chartWidth - 4} y={rsiHeight * 0.7 + 8} fill="#787b86" fontSize="8" textAnchor="end">30</text>

                {(() => {
                  const pts = rsiData.map((val, idx) => {
                    const x = idx * candleSpacing + candleSpacing / 2;
                    const y = rsiHeight - ((val - 20) / 60) * rsiHeight;
                    return `${x},${y}`;
                  });
                  return (
                    <path
                      d={`M ${pts.join(' L ')}`}
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="1.5"
                    />
                  );
                })()}
              </g>
            )}

            {/* Crosshair following cursor */}
            {mousePos && (
              <g>
                <line
                  x1={mousePos.x}
                  y1={0}
                  x2={mousePos.x}
                  y2={totalSvgHeight}
                  stroke="#787b86"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <line
                  x1={0}
                  y1={mousePos.y}
                  x2={chartWidth}
                  y2={mousePos.y}
                  stroke="#787b86"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                {/* Crosshair Y price tag */}
                {mousePos.y <= chartHeight && (
                  <g transform={`translate(${chartWidth - 55}, ${mousePos.y - 8})`}>
                    <rect width="52" height="16" fill="#2962ff" rx="2" />
                    <text
                      x="26"
                      y="11"
                      fill="#fff"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                    >
                      {(maxPrice - (mousePos.y / chartHeight) * priceRange).toFixed(2)}
                    </text>
                  </g>
                )}
              </g>
            )}
          </svg>
        </div>

        {/* Technical Gauge & Fundamentals Drawer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-t border-[#2a2e39] bg-[#181b24] text-xs">
          {/* Gauge Meter: Technical Analysis */}
          <div className="flex flex-col justify-between p-3 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">Technical Rating</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                symbol.technicalRating.includes('Buy')
                  ? 'bg-[#089981]/20 text-[#089981]'
                  : symbol.technicalRating.includes('Sell')
                  ? 'bg-[#f23645]/20 text-[#f23645]'
                  : 'bg-[#2a2e39] text-[#d1d4dc]'
              }`}>
                {symbol.technicalRating}
              </span>
            </div>

            {/* TradingView Iconic 5-step Speedometer Arc */}
            <div className="py-2 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-[10px] text-[#787b86] px-1 mb-1 font-mono">
                <span>Strong Sell</span>
                <span>Neutral</span>
                <span>Strong Buy</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#131722] flex overflow-hidden gap-1 p-0.5">
                <div className={`flex-1 rounded-sm ${symbol.technicalRating === 'Strong Sell' ? 'bg-[#f23645]' : 'bg-[#f23645]/25'}`}></div>
                <div className={`flex-1 rounded-sm ${symbol.technicalRating === 'Sell' ? 'bg-[#f23645]' : 'bg-[#f23645]/25'}`}></div>
                <div className={`flex-1 rounded-sm ${symbol.technicalRating === 'Neutral' ? 'bg-amber-400' : 'bg-amber-400/25'}`}></div>
                <div className={`flex-1 rounded-sm ${symbol.technicalRating === 'Buy' ? 'bg-[#089981]' : 'bg-[#089981]/25'}`}></div>
                <div className={`flex-1 rounded-sm ${symbol.technicalRating === 'Strong Buy' ? 'bg-[#089981]' : 'bg-[#089981]/25'}`}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#787b86] pt-1">
              <div>Oscillators: <span className="text-[#d1d4dc] font-semibold">{symbol.oscillators.rating}</span></div>
              <div>Moving Avgs: <span className="text-[#d1d4dc] font-semibold">{symbol.movingAverages.rating}</span></div>
            </div>
          </div>

          {/* Key Fundamentals */}
          <div className="p-3 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
            <div className="font-semibold text-white mb-2">Key Statistics</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-mono tabular-nums">
              <div className="flex justify-between text-[#787b86]">
                <span>Prev Close</span>
                <span className="text-[#d1d4dc]">${symbol.fundamentals?.prevClose?.toFixed(2) || (symbol.price * 0.99).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#787b86]">
                <span>24h Range</span>
                <span className="text-[#d1d4dc]">{symbol.low24h.toFixed(1)} - {symbol.high24h.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-[#787b86]">
                <span>52W High</span>
                <span className="text-[#d1d4dc]">${symbol.fundamentals?.week52High?.toFixed(2) || (symbol.price * 1.15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#787b86]">
                <span>52W Low</span>
                <span className="text-[#d1d4dc]">${symbol.fundamentals?.week52Low?.toFixed(2) || (symbol.price * 0.75).toFixed(2)}</span>
              </div>
              {symbol.marketCap && (
                <div className="flex justify-between text-[#787b86]">
                  <span>Market Cap</span>
                  <span className="text-[#d1d4dc]">{symbol.marketCap}</span>
                </div>
              )}
              {symbol.pe && (
                <div className="flex justify-between text-[#787b86]">
                  <span>P/E Ratio</span>
                  <span className="text-[#d1d4dc]">{symbol.pe}x</span>
                </div>
              )}
            </div>
          </div>

          {/* Sector & Market Info */}
          <div className="p-3 rounded-lg bg-[#1e222d] border border-[#2a2e39] flex flex-col justify-between">
            <div>
              <div className="font-semibold text-white mb-1.5">Asset Profile</div>
              <p className="text-[11px] text-[#9598a1] line-clamp-2 leading-relaxed">
                {symbol.name} ({symbol.symbol}) is actively traded on the {symbol.exchange} exchange. Real-time candlestick data stream and quantitative metrics updated.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-[#2a2e39] text-[11px] text-[#787b86]">
              <span>Sector: <strong className="text-[#d1d4dc]">{symbol.sector || 'Global Equities'}</strong></span>
              <span>·</span>
              <span>Vol: <strong className="text-[#d1d4dc]">{symbol.volume}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
