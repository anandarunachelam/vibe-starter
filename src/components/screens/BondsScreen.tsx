import React from 'react';
import { SymbolData } from '../../types/market';
import { Sparkline } from '../Sparkline';
import { Clock, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';

interface BondsScreenProps {
  bondSymbols: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const BondsScreen: React.FC<BondsScreenProps> = ({
  bondSymbols,
  onSelectSymbol,
}) => {
  const bonds = bondSymbols.filter((s) => s.category === 'bond');

  // US Treasury Yield Curve Points
  const yieldCurveData = [
    { maturity: '1M', yield: 4.62 },
    { maturity: '3M', yield: 4.54 },
    { maturity: '6M', yield: 4.45 },
    { maturity: '1Y', yield: 4.38 },
    { maturity: '2Y', yield: 4.34 },
    { maturity: '5Y', yield: 4.35 },
    { maturity: '10Y', yield: 4.42 },
    { maturity: '20Y', yield: 4.68 },
    { maturity: '30Y', yield: 4.61 },
  ];

  const spread10Y2Y = (4.42 - 4.34).toFixed(2); // +8 bps normal slope

  // Yield Curve SVG coordinates
  const svgWidth = 680;
  const svgHeight = 220;
  const padding = 35;
  const minYield = 4.1;
  const maxYield = 4.8;
  const yieldRange = maxYield - minYield;

  const points = yieldCurveData.map((d, i) => {
    const x = padding + (i / (yieldCurveData.length - 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((d.yield - minYield) / yieldRange) * (svgHeight - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pt.x},${pt.y}`;
  }, '');

  return (
    <div className="space-y-6">
      {/* Yield Curve Graph Container */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2962ff]" />
              <h2 className="font-bold text-white text-sm">US Treasury Benchmark Yield Curve</h2>
            </div>
            <p className="text-xs text-[#787b86] mt-0.5">
              Live sovereign curve maturities from 1-month bill to 30-year bond
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-[#787b86]">10Y - 2Y Spread</div>
              <div className="font-mono text-xs font-bold text-[#089981]">
                +{spread10Y2Y}% (+8 bps)
              </div>
            </div>
            <div className="px-2.5 py-1 rounded bg-[#089981]/15 text-[#089981] text-xs font-semibold">
              Normal Upward Slope
            </div>
          </div>
        </div>

        {/* Responsive Yield Curve SVG */}
        <div className="w-full overflow-x-auto bg-[#131722] rounded-lg p-2 border border-[#2a2e39]">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-48 select-none"
          >
            {/* Grid Lines Horizontal */}
            {[4.2, 4.4, 4.6].map((lvl) => {
              const y = svgHeight - padding - ((lvl - minYield) / yieldRange) * (svgHeight - padding * 2);
              return (
                <g key={`y-${lvl}`}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={svgWidth - padding}
                    y2={y}
                    stroke="#2a2e39"
                    strokeDasharray="3 3"
                    strokeWidth="0.8"
                  />
                  <text
                    x={padding - 6}
                    y={y + 3}
                    fill="#5d606b"
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    textAnchor="end"
                  >
                    {lvl.toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* Yield Curve Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#2962ff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Maturity Points & Yield Labels */}
            {points.map((pt) => (
              <g key={pt.maturity}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#131722"
                  stroke="#2962ff"
                  strokeWidth="2"
                />
                <text
                  x={pt.x}
                  y={pt.y - 8}
                  fill="#d1d4dc"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {pt.yield.toFixed(2)}%
                </text>
                <text
                  x={pt.x}
                  y={svgHeight - 12}
                  fill="#787b86"
                  fontSize="10"
                  fontFamily="Plus Jakarta Sans"
                  textAnchor="middle"
                >
                  {pt.maturity}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Sovereign Bond Quotes Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#2a2e39] bg-[#181b24] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2962ff]" />
            <h2 className="font-bold text-white text-sm">Global Government Bond Rates</h2>
          </div>
          <span className="text-xs text-[#787b86]">US, Germany, UK, Japan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono tabular-nums">
            <thead className="bg-[#131722] text-[#787b86] uppercase text-[10px] border-b border-[#2a2e39]">
              <tr>
                <th className="px-4 py-2.5 font-sans">Instrument</th>
                <th className="px-4 py-2.5 font-sans">Country</th>
                <th className="px-4 py-2.5 text-right">Yield</th>
                <th className="px-4 py-2.5 text-right">Change (bps)</th>
                <th className="px-4 py-2.5 text-right">% Change</th>
                <th className="px-4 py-2.5 text-center">Trend</th>
                <th className="px-4 py-2.5 text-right font-sans">Technical</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {bonds.map((bond) => {
                const isPos = bond.changePercent >= 0;
                return (
                  <tr
                    key={bond.symbol}
                    onClick={() => onSelectSymbol(bond)}
                    className="hover:bg-[#252a37] transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3 font-sans">
                      <div className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                        {bond.name}
                      </div>
                      <div className="text-[10px] text-[#787b86] font-mono">
                        {bond.symbol}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-[#9598a1]">
                      {bond.country}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-white">
                      {bond.price.toFixed(2)}%
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{(bond.change * 100).toFixed(1)} bps
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{bond.changePercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <Sparkline data={bond.sparkline} isPositive={isPos} width={65} height={18} strokeWidth={1.5} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        bond.technicalRating.includes('Buy')
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : 'bg-[#2a2e39] text-[#787b86]'
                      }`}>
                        {bond.technicalRating}
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
