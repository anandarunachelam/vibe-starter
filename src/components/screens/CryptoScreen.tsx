import React, { useState } from 'react';
import { SymbolData } from '../../types/market';
import { Sparkline } from '../Sparkline';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Cpu,
  Layers
} from 'lucide-react';

interface CryptoScreenProps {
  cryptoSymbols: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const CryptoScreen: React.FC<CryptoScreenProps> = ({
  cryptoSymbols,
  onSelectSymbol,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const cryptos = cryptoSymbols.filter((s) => s.category === 'crypto');

  return (
    <div className="space-y-6">
      {/* Crypto Global Stats Header Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#1e222d] border border-[#2a2e39] p-3.5 rounded-xl shadow-sm">
          <div className="text-[11px] text-[#787b86] mb-1">Total Crypto Market Cap</div>
          <div className="font-mono text-xl font-bold text-white tabular-nums">$2.74 Trillion</div>
          <div className="text-xs text-[#089981] font-mono font-semibold mt-0.5">+3.62% 24h</div>
        </div>

        <div className="bg-[#1e222d] border border-[#2a2e39] p-3.5 rounded-xl shadow-sm">
          <div className="text-[11px] text-[#787b86] mb-1">24h Trading Volume</div>
          <div className="font-mono text-xl font-bold text-white tabular-nums">$128.5 Billion</div>
          <div className="text-xs text-[#d1d4dc] font-mono mt-0.5">Spot & Perpetuals</div>
        </div>

        <div className="bg-[#1e222d] border border-[#2a2e39] p-3.5 rounded-xl shadow-sm">
          <div className="text-[11px] text-[#787b86] mb-1">Bitcoin Dominance</div>
          <div className="font-mono text-xl font-bold text-amber-400 tabular-nums">54.8%</div>
          <div className="text-xs text-[#787b86] font-mono mt-0.5">ETH Dominance: 14.2%</div>
        </div>

        <div className="bg-[#1e222d] border border-[#2a2e39] p-3.5 rounded-xl shadow-sm">
          <div className="text-[11px] text-[#787b86] mb-1">Fear & Greed Index</div>
          <div className="font-mono text-xl font-bold text-[#089981] tabular-nums">76 / 100</div>
          <div className="text-xs text-[#089981] font-semibold mt-0.5">Extreme Greed</div>
        </div>
      </div>

      {/* Crypto Screen Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[#2a2e39] bg-[#181b24]">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#2962ff]" />
            <h2 className="font-bold text-white text-sm">Top Cryptocurrencies by Market Cap</h2>
          </div>

          <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
            {['all', 'Layer 1', 'DeFi', 'Infrastructure'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#131722] text-[#787b86] uppercase font-mono text-[10px] border-b border-[#2a2e39]">
              <tr>
                <th className="px-4 py-2.5">Asset</th>
                <th className="px-4 py-2.5 text-right">Price</th>
                <th className="px-4 py-2.5 text-right">24h Change</th>
                <th className="px-4 py-2.5 text-right">24h High / Low</th>
                <th className="px-4 py-2.5 text-right">24h Volume</th>
                <th className="px-4 py-2.5 text-right">Market Cap</th>
                <th className="px-4 py-2.5 text-center">Trend (7d)</th>
                <th className="px-4 py-2.5 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50 font-mono tabular-nums">
              {cryptos.map((coin, rank) => {
                const isPos = coin.changePercent >= 0;
                return (
                  <tr
                    key={coin.symbol}
                    onClick={() => onSelectSymbol(coin)}
                    className="hover:bg-[#252a37] transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono text-[#787b86] w-4">{rank + 1}</span>
                        <div className="w-7 h-7 rounded bg-[#2962ff]/10 border border-[#2962ff]/30 text-[#2962ff] flex items-center justify-center font-bold text-xs">
                          {coin.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                            {coin.symbol.replace('USDT', '')}
                          </div>
                          <div className="text-[11px] text-[#787b86]">
                            {coin.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-white">
                      ${coin.price > 1000 ? coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : coin.price.toFixed(coin.price < 1 ? 4 : 2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      <div className="inline-flex items-center gap-0.5">
                        {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isPos ? '+' : ''}{coin.changePercent.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-[#9598a1] text-[11px]">
                      {coin.low24h > 1000 ? coin.low24h.toLocaleString() : coin.low24h.toFixed(2)} - {coin.high24h > 1000 ? coin.high24h.toLocaleString() : coin.high24h.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-[#d1d4dc]">
                      {coin.volume}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-white">
                      {coin.marketCap}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <Sparkline data={coin.sparkline} isPositive={isPos} width={65} height={18} strokeWidth={1.5} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        coin.technicalRating.includes('Buy')
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : 'bg-[#2a2e39] text-[#787b86]'
                      }`}>
                        {coin.technicalRating}
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
