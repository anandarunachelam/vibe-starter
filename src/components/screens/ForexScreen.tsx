import React from 'react';
import { SymbolData } from '../../types/market';
import { Sparkline } from '../Sparkline';
import { TrendingUp, TrendingDown, CircleDollarSign, ArrowRightLeft } from 'lucide-react';

interface ForexScreenProps {
  forexSymbols: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
  crossRates: any[];
}

export const ForexScreen: React.FC<ForexScreenProps> = ({
  forexSymbols,
  onSelectSymbol,
  crossRates,
}) => {
  const pairs = forexSymbols.filter((s) => s.category === 'forex');

  // Currency Strength Heatmap indexes
  const currencyStrength = [
    { code: 'USD', strength: '+0.48%', status: 'Strong', color: 'text-[#089981]' },
    { code: 'JPY', strength: '-0.62%', status: 'Weak', color: 'text-[#f23645]' },
    { code: 'EUR', strength: '-0.30%', status: 'Neutral', color: 'text-amber-400' },
    { code: 'GBP', strength: '-0.43%', status: 'Neutral', color: 'text-amber-400' },
    { code: 'CHF', strength: '+0.12%', status: 'Mild Strong', color: 'text-[#089981]' },
    { code: 'AUD', strength: '+0.25%', status: 'Mild Strong', color: 'text-[#089981]' },
  ];

  return (
    <div className="space-y-6">
      {/* Currency Strength Relative Index */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-4 h-4 text-[#2962ff]" />
            <h2 className="font-bold text-white text-sm">Currency Strength Meter</h2>
          </div>
          <span className="text-xs text-[#787b86]">Weighted against G10 currency basket</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {currencyStrength.map((curr) => (
            <div
              key={curr.code}
              className="bg-[#131722] border border-[#2a2e39] p-3 rounded-lg text-center"
            >
              <div className="font-bold text-sm text-white">{curr.code}</div>
              <div className={`font-mono text-xs font-bold tabular-nums mt-0.5 ${curr.color}`}>
                {curr.strength}
              </div>
              <div className="text-[10px] text-[#787b86] mt-0.5">{curr.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Forex Major Pairs Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#2a2e39] bg-[#181b24] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-[#2962ff]" />
            <h2 className="font-bold text-white text-sm">Major & Minor Currency Pairs</h2>
          </div>
          <span className="text-xs text-[#787b86] font-mono">24/5 Spot Interbank FX</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono tabular-nums">
            <thead className="bg-[#131722] text-[#787b86] uppercase text-[10px] border-b border-[#2a2e39]">
              <tr>
                <th className="px-4 py-2.5 font-sans">Pair</th>
                <th className="px-4 py-2.5 text-right">Bid</th>
                <th className="px-4 py-2.5 text-right">Ask</th>
                <th className="px-4 py-2.5 text-right">Change (Pips)</th>
                <th className="px-4 py-2.5 text-right">% Change</th>
                <th className="px-4 py-2.5 text-center">Trend</th>
                <th className="px-4 py-2.5 text-right font-sans">Technical</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {pairs.map((pair) => {
                const isPos = pair.changePercent >= 0;
                const pips = (pair.change * (pair.symbol.includes('JPY') ? 100 : 10000)).toFixed(1);
                return (
                  <tr
                    key={pair.symbol}
                    onClick={() => onSelectSymbol(pair)}
                    className="hover:bg-[#252a37] transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                          {pair.symbol.slice(0, 3)}/{pair.symbol.slice(3)}
                        </span>
                        <span className="text-[11px] text-[#787b86]">{pair.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-white">
                      {(pair.price * 0.9999).toFixed(pair.price < 10 ? 4 : 2)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-white">
                      {(pair.price * 1.0001).toFixed(pair.price < 10 ? 4 : 2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{pips} pips
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{pair.changePercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <Sparkline data={pair.sparkline} isPositive={isPos} width={65} height={18} strokeWidth={1.5} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        pair.technicalRating.includes('Buy')
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : pair.technicalRating.includes('Sell')
                          ? 'bg-[#f23645]/15 text-[#f23645]'
                          : 'bg-[#2a2e39] text-[#787b86]'
                      }`}>
                        {pair.technicalRating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross Rates Grid */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#2a2e39] bg-[#181b24]">
          <h2 className="font-bold text-white text-sm">FX Spot Cross Rates Table</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono tabular-nums">
            <thead className="bg-[#131722] text-[#787b86] uppercase text-[10px] border-b border-[#2a2e39]">
              <tr>
                <th className="px-4 py-2.5 font-sans">Base</th>
                <th className="px-4 py-2.5 text-right">USD</th>
                <th className="px-4 py-2.5 text-right">EUR</th>
                <th className="px-4 py-2.5 text-right">GBP</th>
                <th className="px-4 py-2.5 text-right">JPY</th>
                <th className="px-4 py-2.5 text-right">CHF</th>
                <th className="px-4 py-2.5 text-right">AUD</th>
                <th className="px-4 py-2.5 text-right">CAD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {crossRates.map((row) => (
                <tr key={row.base} className="hover:bg-[#252a37] transition-colors">
                  <td className="px-4 py-2.5 font-bold text-white font-sans">{row.base}</td>
                  <td className="px-4 py-2.5 text-right">{row.USD ? row.USD.toFixed(4) : '1.0000'}</td>
                  <td className="px-4 py-2.5 text-right">{row.EUR ? row.EUR.toFixed(4) : '1.0000'}</td>
                  <td className="px-4 py-2.5 text-right">{row.GBP ? row.GBP.toFixed(4) : '1.0000'}</td>
                  <td className="px-4 py-2.5 text-right">{row.JPY ? row.JPY.toFixed(2) : '1.00'}</td>
                  <td className="px-4 py-2.5 text-right">{row.CHF ? row.CHF.toFixed(4) : '1.0000'}</td>
                  <td className="px-4 py-2.5 text-right">{row.AUD ? row.AUD.toFixed(4) : '1.0000'}</td>
                  <td className="px-4 py-2.5 text-right">{row.CAD ? row.CAD.toFixed(4) : '1.0000'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
