import React from 'react';
import { SymbolData } from '../types/market';
import { Sparkline } from './Sparkline';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerTapeProps {
  symbols: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
  flashingSymbols?: Record<string, 'up' | 'down'>;
}

export const TickerTape: React.FC<TickerTapeProps> = ({
  symbols,
  onSelectSymbol,
  flashingSymbols = {},
}) => {
  // Double list to allow seamless continuous horizontal scrolling
  const tapeList = [...symbols.slice(0, 14), ...symbols.slice(0, 14)];

  return (
    <div className="w-full bg-[#131722] dark:bg-[#131722] border-b border-[#2a2e39] dark:border-[#2a2e39] text-xs h-9 overflow-hidden flex items-center select-none z-20">
      <div className="flex items-center animate-ticker whitespace-nowrap gap-0">
        {tapeList.map((item, idx) => {
          const isPos = item.changePercent >= 0;
          const flashState = flashingSymbols[item.symbol];
          
          return (
            <button
              key={`${item.symbol}-${idx}`}
              onClick={() => onSelectSymbol(item)}
              className={`inline-flex items-center gap-2.5 px-3.5 py-1 hover:bg-[#1e222d] dark:hover:bg-[#1e222d] border-r border-[#2a2e39]/60 dark:border-[#2a2e39]/60 transition-colors text-left shrink-0 cursor-pointer ${
                flashState === 'up'
                  ? 'bg-emerald-500/20'
                  : flashState === 'down'
                  ? 'bg-rose-500/20'
                  : ''
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#d1d4dc] hover:text-white tracking-tight">
                  {item.symbol}
                </span>
                <span className="text-[10px] text-[#787b86]">
                  {item.category === 'forex' ? 'FX' : item.exchange.slice(0, 6)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-mono tabular-nums">
                <span className="text-[#d1d4dc] font-semibold">
                  {item.price > 1000
                    ? item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : item.price.toFixed(item.price < 1 ? 4 : 2)}
                </span>

                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
                    isPos ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPos ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {isPos ? '+' : ''}
                  {item.changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="opacity-80">
                <Sparkline data={item.sparkline} isPositive={isPos} width={42} height={16} strokeWidth={1.5} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
