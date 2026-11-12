import React, { useState } from 'react';
import { SymbolData } from '../../types/market';
import { Sparkline } from '../Sparkline';
import { Fuel, TrendingUp, TrendingDown, Flame, Droplet, Shield } from 'lucide-react';

interface FuturesScreenProps {
  futuresSymbols: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const FuturesScreen: React.FC<FuturesScreenProps> = ({
  futuresSymbols,
  onSelectSymbol,
}) => {
  const [activeGroup, setActiveGroup] = useState<string>('all');

  const commodities = futuresSymbols.filter((s) => s.category === 'commodity');

  return (
    <div className="space-y-6">
      {/* Commodities Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#1e222d] border border-[#2a2e39] p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#787b86]">Precious Metals Benchmark</div>
            <div className="font-bold text-white text-sm">Gold (XAU/USD)</div>
            <div className="font-mono text-xs font-semibold text-[#089981] mt-0.5">$2,624.50 (+0.70%)</div>
          </div>
        </div>

        <div className="bg-[#1e222d] border border-[#2a2e39] p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#787b86]">Global Energy Benchmark</div>
            <div className="font-bold text-white text-sm">Crude Oil WTI</div>
            <div className="font-mono text-xs font-semibold text-[#f23645] mt-0.5">$68.40 (-1.79%)</div>
          </div>
        </div>

        <div className="bg-[#1e222d] border border-[#2a2e39] p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#787b86]">Industrial Metals</div>
            <div className="font-bold text-white text-sm">Silver (XAG/USD)</div>
            <div className="font-mono text-xs font-semibold text-[#089981] mt-0.5">$30.85 (+1.38%)</div>
          </div>
        </div>
      </div>

      {/* Commodities Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#2a2e39] bg-[#181b24] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-[#2962ff]" />
            <h2 className="font-bold text-white text-sm">Commodity Futures & Spot Rates</h2>
          </div>
          <span className="text-xs text-[#787b86] font-mono">NYMEX · COMEX · ICE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono tabular-nums">
            <thead className="bg-[#131722] text-[#787b86] uppercase text-[10px] border-b border-[#2a2e39]">
              <tr>
                <th className="px-4 py-2.5 font-sans">Commodity</th>
                <th className="px-4 py-2.5 font-sans">Sector</th>
                <th className="px-4 py-2.5 text-right">Price</th>
                <th className="px-4 py-2.5 text-right">Change</th>
                <th className="px-4 py-2.5 text-right">% Change</th>
                <th className="px-4 py-2.5 text-right">24h High / Low</th>
                <th className="px-4 py-2.5 text-center">Trend</th>
                <th className="px-4 py-2.5 text-right font-sans">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {commodities.map((comm) => {
                const isPos = comm.changePercent >= 0;
                return (
                  <tr
                    key={comm.symbol}
                    onClick={() => onSelectSymbol(comm)}
                    className="hover:bg-[#252a37] transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3 font-sans">
                      <div className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                        {comm.name}
                      </div>
                      <div className="text-[10px] text-[#787b86] font-mono">
                        {comm.symbol} · {comm.exchange}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-[#9598a1]">
                      {comm.sector}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-white">
                      ${comm.price.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{comm.change.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      <div className="inline-flex items-center gap-0.5">
                        {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isPos ? '+' : ''}{comm.changePercent.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-[11px] text-[#787b86]">
                      {comm.low24h.toFixed(1)} - {comm.high24h.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <Sparkline data={comm.sparkline} isPositive={isPos} width={65} height={18} strokeWidth={1.5} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        comm.technicalRating.includes('Buy')
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : comm.technicalRating.includes('Sell')
                          ? 'bg-[#f23645]/15 text-[#f23645]'
                          : 'bg-[#2a2e39] text-[#787b86]'
                      }`}>
                        {comm.technicalRating}
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
