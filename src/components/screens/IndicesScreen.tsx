import React, { useState } from 'react';
import { SymbolData } from '../../types/market';
import { Sparkline } from '../Sparkline';
import { Globe, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface IndicesScreenProps {
  indices: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const IndicesScreen: React.FC<IndicesScreenProps> = ({
  indices,
  onSelectSymbol,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredIndices = indices.filter((item) => {
    if (item.category !== 'index') return false;
    if (selectedRegion === 'americas') return item.country === 'United States';
    if (selectedRegion === 'europe') return item.country === 'Germany' || item.country === 'United Kingdom';
    if (selectedRegion === 'asia') return item.country === 'Japan';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[#2a2e39] bg-[#181b24]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#2962ff]" />
            <h2 className="font-bold text-white text-sm">Worldwide Benchmark Indices</h2>
          </div>

          <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
            {[
              { id: 'all', label: 'All Global' },
              { id: 'americas', label: 'Americas' },
              { id: 'europe', label: 'Europe' },
              { id: 'asia', label: 'Asia-Pacific' },
            ].map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  selectedRegion === reg.id
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#131722] text-[#787b86] uppercase font-mono text-[10px] border-b border-[#2a2e39]">
              <tr>
                <th className="px-4 py-2.5">Index</th>
                <th className="px-4 py-2.5">Country / Exchange</th>
                <th className="px-4 py-2.5 text-right">Value</th>
                <th className="px-4 py-2.5 text-right">Change</th>
                <th className="px-4 py-2.5 text-right">% Change</th>
                <th className="px-4 py-2.5 text-right">52W Range</th>
                <th className="px-4 py-2.5 text-center">Trend</th>
                <th className="px-4 py-2.5 text-right">Technical</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50 font-mono tabular-nums">
              {filteredIndices.map((idx) => {
                const isPos = idx.changePercent >= 0;
                return (
                  <tr
                    key={idx.symbol}
                    onClick={() => onSelectSymbol(idx)}
                    className="hover:bg-[#252a37] transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3 font-sans">
                      <div className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                        {idx.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#787b86]">
                        {idx.symbol}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-[#9598a1]">
                      {idx.country} · {idx.exchange}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-white">
                      {idx.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{idx.change.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      <div className="inline-flex items-center gap-0.5">
                        {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isPos ? '+' : ''}{idx.changePercent.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-[11px] text-[#787b86]">
                      {idx.fundamentals?.week52Low?.toFixed(0)} - {idx.fundamentals?.week52High?.toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <Sparkline data={idx.sparkline} isPositive={isPos} width={65} height={18} strokeWidth={1.5} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        idx.technicalRating.includes('Buy')
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : 'bg-[#2a2e39] text-[#787b86]'
                      }`}>
                        {idx.technicalRating}
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
