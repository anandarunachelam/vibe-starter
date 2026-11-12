import { SymbolData, NewsArticle, EconomicEvent, TreemapNode, CandleData } from '../types/market';

// Helper to generate candle history for realistic chart rendering
export function generateCandleHistory(
  basePrice: number,
  timeframe: string,
  trendBias: number = 0.001
): CandleData[] {
  let count = 48;
  let intervalMinutes = 30;

  if (timeframe === '1D') {
    count = 39; // 39 x 10m = 6.5h trading day
    intervalMinutes = 10;
  } else if (timeframe === '5D') {
    count = 45;
    intervalMinutes = 60;
  } else if (timeframe === '1M') {
    count = 30;
    intervalMinutes = 1440;
  } else if (timeframe === '6M') {
    count = 60;
    intervalMinutes = 1440 * 3;
  } else if (timeframe === '1Y') {
    count = 52;
    intervalMinutes = 1440 * 7;
  } else {
    count = 60;
    intervalMinutes = 1440 * 14;
  }

  const candles: CandleData[] = [];
  let currentClose = basePrice * (1 - (trendBias * count * 0.5));
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const timeOffset = (count - i) * intervalMinutes * 60 * 1000;
    const dateObj = new Date(now - timeOffset);
    
    // Format label
    let timeLabel = '';
    if (timeframe === '1D' || timeframe === '5D') {
      timeLabel = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
      timeLabel = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    const volatility = basePrice * 0.008;
    const change = (Math.random() - 0.48 + trendBias) * volatility;
    const open = currentClose;
    const close = Math.max(open + change, basePrice * 0.2);
    const high = Math.max(open, close) + Math.random() * volatility * 0.6;
    const low = Math.min(open, close) - Math.random() * volatility * 0.6;
    const volume = Math.floor(Math.random() * 4500000 + 150000);

    candles.push({
      time: timeLabel,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    currentClose = close;
  }

  return candles;
}

// Generate sparkline values
function generateSparkline(basePrice: number, points: number = 20, isPositive: boolean = true): number[] {
  const result: number[] = [basePrice * (isPositive ? 0.98 : 1.02)];
  let curr = result[0];
  const delta = basePrice * 0.004;
  for (let i = 1; i < points; i++) {
    const step = (Math.random() - (isPositive ? 0.44 : 0.56)) * delta;
    curr += step;
    result.push(Number(curr.toFixed(2)));
  }
  result[result.length - 1] = basePrice;
  return result;
}

export const INITIAL_SYMBOLS: SymbolData[] = [
  // INDICES
  {
    symbol: 'SPX',
    name: 'S&P 500 Index',
    category: 'index',
    exchange: 'S&P DOW JONES',
    price: 5983.25,
    change: 45.60,
    changePercent: 0.77,
    high24h: 5998.40,
    low24h: 5932.10,
    volume: '2.48B',
    sparkline: generateSparkline(5983.25, 20, true),
    technicalRating: 'Strong Buy',
    sector: 'Broad Market',
    country: 'United States',
    currency: 'USD',
    oscillators: { rsi: 64.2, macd: '+14.2', stoch: '78.5', rating: 'Buy' },
    movingAverages: { ma20: 5910.4, ma50: 5820.1, ma200: 5460.8, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 5937.65,
      open: 5942.10,
      week52High: 6012.30,
      week52Low: 4953.56,
      avgVolume: '2.85B',
      dividendYield: '1.24%',
    }
  },
  {
    symbol: 'NDX',
    name: 'Nasdaq 100',
    category: 'index',
    exchange: 'NASDAQ',
    price: 21120.40,
    change: 234.80,
    changePercent: 1.12,
    high24h: 21185.00,
    low24h: 20870.20,
    volume: '4.92B',
    sparkline: generateSparkline(21120.40, 20, true),
    technicalRating: 'Strong Buy',
    sector: 'Technology & Growth',
    country: 'United States',
    currency: 'USD',
    oscillators: { rsi: 68.4, macd: '+92.1', stoch: '82.0', rating: 'Strong Buy' },
    movingAverages: { ma20: 20740.0, ma50: 20180.5, ma200: 18850.2, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 20885.60,
      open: 20910.00,
      week52High: 21250.00,
      week52Low: 16973.10,
      avgVolume: '5.10B',
    }
  },
  {
    symbol: 'DJI',
    name: 'Dow Jones Industrial Average',
    category: 'index',
    exchange: 'S&P DOW JONES',
    price: 43910.90,
    change: -128.40,
    changePercent: -0.29,
    high24h: 44120.00,
    low24h: 43810.50,
    volume: '380M',
    sparkline: generateSparkline(43910.90, 20, false),
    technicalRating: 'Neutral',
    sector: 'Industrial & Blue Chip',
    country: 'United States',
    currency: 'USD',
    oscillators: { rsi: 52.1, macd: '-4.8', stoch: '49.0', rating: 'Neutral' },
    movingAverages: { ma20: 43680.0, ma50: 42800.0, ma200: 39850.0, rating: 'Buy' },
    fundamentals: {
      prevClose: 44039.30,
      open: 44050.20,
      week52High: 44486.72,
      week52Low: 37122.95,
      avgVolume: '410M',
      dividendYield: '1.82%',
    }
  },
  {
    symbol: 'RUT',
    name: 'Russell 2000',
    category: 'index',
    exchange: 'FTSE RUSSELL',
    price: 2410.15,
    change: 32.40,
    changePercent: 1.36,
    high24h: 2422.00,
    low24h: 2375.10,
    volume: '1.2B',
    sparkline: generateSparkline(2410.15, 20, true),
    technicalRating: 'Buy',
    sector: 'Small Cap',
    country: 'United States',
    currency: 'USD',
    oscillators: { rsi: 61.5, macd: '+8.4', stoch: '71.2', rating: 'Buy' },
    movingAverages: { ma20: 2360.2, ma50: 2280.4, ma200: 2110.0, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 2377.75,
      open: 2382.00,
      week52High: 2445.00,
      week52Low: 1920.40,
      avgVolume: '1.35B',
    }
  },
  {
    symbol: 'DAX',
    name: 'DAX 40',
    category: 'index',
    exchange: 'DEUTSCHE BORSE',
    price: 19420.80,
    change: 142.10,
    changePercent: 0.74,
    high24h: 19480.00,
    low24h: 19290.40,
    volume: '84M',
    sparkline: generateSparkline(19420.80, 20, true),
    technicalRating: 'Buy',
    sector: 'Europe Equities',
    country: 'Germany',
    currency: 'EUR',
    oscillators: { rsi: 58.0, macd: '+12.0', stoch: '65.0', rating: 'Buy' },
    movingAverages: { ma20: 19250.0, ma50: 18980.0, ma200: 18200.0, rating: 'Buy' },
    fundamentals: {
      prevClose: 19278.70,
      open: 19310.00,
      week52High: 19674.68,
      week52Low: 15600.20,
      avgVolume: '92M',
    }
  },
  {
    symbol: 'FTSE',
    name: 'FTSE 100',
    category: 'index',
    exchange: 'LSE',
    price: 8140.50,
    change: -18.20,
    changePercent: -0.22,
    high24h: 8180.20,
    low24h: 8120.00,
    volume: '650M',
    sparkline: generateSparkline(8140.50, 20, false),
    technicalRating: 'Neutral',
    sector: 'UK Equities',
    country: 'United Kingdom',
    currency: 'GBP',
    oscillators: { rsi: 48.2, macd: '-2.1', stoch: '44.0', rating: 'Neutral' },
    movingAverages: { ma20: 8210.0, ma50: 8240.0, ma200: 8080.0, rating: 'Neutral' },
    fundamentals: {
      prevClose: 8158.70,
      open: 8162.00,
      week52High: 8474.41,
      week52Low: 7380.00,
      avgVolume: '710M',
    }
  },
  {
    symbol: 'N225',
    name: 'Nikkei 225',
    category: 'index',
    exchange: 'TOKYO SE',
    price: 39380.20,
    change: 410.80,
    changePercent: 1.05,
    high24h: 39510.00,
    low24h: 39020.00,
    volume: '1.4B',
    sparkline: generateSparkline(39380.20, 20, true),
    technicalRating: 'Buy',
    sector: 'Asia-Pacific',
    country: 'Japan',
    currency: 'JPY',
    oscillators: { rsi: 62.0, macd: '+35.0', stoch: '75.0', rating: 'Buy' },
    movingAverages: { ma20: 38800.0, ma50: 38200.0, ma200: 37500.0, rating: 'Buy' },
    fundamentals: {
      prevClose: 38969.40,
      open: 39100.00,
      week52High: 42426.77,
      week52Low: 31156.10,
      avgVolume: '1.55B',
    }
  },

  // EQUITIES / STOCKS
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    category: 'stock',
    exchange: 'NASDAQ',
    price: 148.50,
    change: 4.85,
    changePercent: 3.38,
    high24h: 149.75,
    low24h: 144.10,
    volume: '78.4M',
    marketCap: '$3.65T',
    pe: 65.4,
    sector: 'Technology',
    country: 'United States',
    currency: 'USD',
    sparkline: generateSparkline(148.50, 20, true),
    technicalRating: 'Strong Buy',
    oscillators: { rsi: 71.8, macd: '+3.42', stoch: '86.4', rating: 'Strong Buy' },
    movingAverages: { ma20: 141.2, ma50: 132.8, ma200: 104.5, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 143.65,
      open: 144.50,
      week52High: 149.77,
      week52Low: 45.43,
      avgVolume: '62.1M',
      beta: 1.68,
      dividendYield: '0.03%',
      nextEarnings: 'Nov 20, 2024'
    }
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'stock',
    exchange: 'NASDAQ',
    price: 228.40,
    change: 2.15,
    changePercent: 0.95,
    high24h: 229.80,
    low24h: 226.50,
    volume: '44.8M',
    marketCap: '$3.46T',
    pe: 34.8,
    sector: 'Technology',
    country: 'United States',
    currency: 'USD',
    sparkline: generateSparkline(228.40, 20, true),
    technicalRating: 'Buy',
    oscillators: { rsi: 59.4, macd: '+1.15', stoch: '64.0', rating: 'Buy' },
    movingAverages: { ma20: 225.0, ma50: 222.1, ma200: 202.4, rating: 'Buy' },
    fundamentals: {
      prevClose: 226.25,
      open: 227.00,
      week52High: 237.23,
      week52Low: 164.08,
      avgVolume: '51.3M',
      beta: 1.04,
      dividendYield: '0.44%',
      nextEarnings: 'Jan 30, 2025'
    }
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    category: 'stock',
    exchange: 'NASDAQ',
    price: 424.80,
    change: -1.90,
    changePercent: -0.45,
    high24h: 428.20,
    low24h: 422.60,
    volume: '18.9M',
    marketCap: '$3.16T',
    pe: 35.2,
    sector: 'Technology',
    country: 'United States',
    currency: 'USD',
    sparkline: generateSparkline(424.80, 20, false),
    technicalRating: 'Neutral',
    oscillators: { rsi: 51.0, macd: '+0.42', stoch: '52.0', rating: 'Neutral' },
    movingAverages: { ma20: 422.8, ma50: 425.4, ma200: 418.0, rating: 'Neutral' },
    fundamentals: {
      prevClose: 426.70,
      open: 427.10,
      week52High: 468.35,
      week52Low: 366.50,
      avgVolume: '21.5M',
      beta: 1.18,
      dividendYield: '0.78%',
      nextEarnings: 'Jan 28, 2025'
    }
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    category: 'stock',
    exchange: 'NASDAQ',
    price: 208.50,
    change: 3.90,
    changePercent: 1.91,
    high24h: 210.10,
    low24h: 204.80,
    volume: '36.2M',
    marketCap: '$2.19T',
    pe: 43.1,
    sector: 'Consumer Cyclical',
    country: 'United States',
    currency: 'USD',
    sparkline: generateSparkline(208.50, 20, true),
    technicalRating: 'Strong Buy',
    oscillators: { rsi: 69.2, macd: '+2.85', stoch: '84.0', rating: 'Strong Buy' },
    movingAverages: { ma20: 198.5, ma50: 191.0, ma200: 180.2, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 204.60,
      open: 205.20,
      week52High: 211.20,
      week52Low: 139.88,
      avgVolume: '42.0M',
      beta: 1.32,
      nextEarnings: 'Feb 06, 2025'
    }
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    category: 'stock',
    exchange: 'NASDAQ',
    price: 181.20,
    change: 2.80,
    changePercent: 1.57,
    high24h: 182.40,
    low24h: 178.60,
    volume: '24.1M',
    marketCap: '$2.24T',
    pe: 23.4,
    sector: 'Communication',
    country: 'United States',
    currency: 'USD',
    sparkline: generateSparkline(181.20, 20, true),
    technicalRating: 'Buy',
    oscillators: { rsi: 63.8, macd: '+1.92', stoch: '74.2', rating: 'Buy' },
    movingAverages: { ma20: 175.4, ma50: 169.8, ma200: 162.1, rating: 'Buy' },
    fundamentals: {
      prevClose: 178.40,
      open: 179.00,
      week52High: 191.75,
      week52Low: 129.40,
      avgVolume: '28.5M',
      beta: 1.08,
      dividendYield: '0.44%',
      nextEarnings: 'Feb 04, 2025'
    }
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    category: 'stock',
    exchange: 'NASDAQ',
    price: 592.10,
    change: 8.50,
    changePercent: 1.46,
    high24h: 596.00,
    low24h: 583.40,
    volume: '14.2M',
    marketCap: '$1.50T',
    pe: 27.8,
    sector: 'Communication',
    country: 'United States',
    currency: 'USD',
    sparkline: generateSparkline(592.10, 20, true),
    technicalRating: 'Strong Buy',
    oscillators: { rsi: 66.5, macd: '+6.10', stoch: '79.5', rating: 'Strong Buy' },
    movingAverages: { ma20: 580.0, ma50: 556.0, ma200: 495.0, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 583.60,
      open: 585.00,
      week52High: 602.95,
      week52Low: 313.66,
      avgVolume: '16.4M',
      beta: 1.25,
      dividendYield: '0.34%',
      nextEarnings: 'Feb 05, 2025'
    }
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    category: 'stock',
    exchange: 'NASDAQ',
    price: 338.90,
    change: 18.20,
    changePercent: 5.67,
    high24h: 345.00,
    low24h: 320.10,
    volume: '98.5M',
    marketCap: '$1.08T',
    pe: 98.2,
    sector: 'Consumer Cyclical',
    country: 'United States',
    currency: 'USD',
    sparkline: generateSparkline(338.90, 20, true),
    technicalRating: 'Strong Buy',
    oscillators: { rsi: 78.4, macd: '+15.8', stoch: '91.2', rating: 'Strong Buy' },
    movingAverages: { ma20: 280.0, ma50: 242.0, ma200: 210.0, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 320.70,
      open: 324.50,
      week52High: 358.64,
      week52Low: 138.80,
      avgVolume: '88.0M',
      beta: 2.34,
      nextEarnings: 'Jan 22, 2025'
    }
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies',
    category: 'stock',
    exchange: 'NYSE',
    price: 62.40,
    change: 4.10,
    changePercent: 7.03,
    high24h: 63.80,
    low24h: 58.20,
    volume: '64.5M',
    marketCap: '$140.2B',
    pe: 115.0,
    sector: 'Technology',
    country: 'United States',
    currency: 'USD',
    sparkline: generateSparkline(62.40, 20, true),
    technicalRating: 'Strong Buy',
    oscillators: { rsi: 82.1, macd: '+3.1', stoch: '93.0', rating: 'Strong Buy' },
    movingAverages: { ma20: 52.0, ma50: 42.5, ma200: 29.8, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 58.30,
      open: 59.00,
      week52High: 63.80,
      week52Low: 15.66,
      avgVolume: '54.0M',
      beta: 2.70,
    }
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    category: 'stock',
    exchange: 'NYSE',
    price: 242.10,
    change: 3.40,
    changePercent: 1.42,
    high24h: 243.50,
    low24h: 239.00,
    volume: '9.8M',
    marketCap: '$688.5B',
    pe: 12.8,
    sector: 'Financial',
    country: 'United States',
    currency: 'USD',
    sparkline: generateSparkline(242.10, 20, true),
    technicalRating: 'Buy',
    oscillators: { rsi: 64.0, macd: '+2.1', stoch: '72.0', rating: 'Buy' },
    movingAverages: { ma20: 232.0, ma50: 224.0, ma200: 202.0, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 238.70,
      open: 240.00,
      week52High: 248.00,
      week52Low: 147.20,
      avgVolume: '9.2M',
      dividendYield: '2.08%',
    }
  },
  {
    symbol: 'LLY',
    name: 'Eli Lilly and Company',
    category: 'stock',
    exchange: 'NYSE',
    price: 785.20,
    change: -12.40,
    changePercent: -1.55,
    high24h: 802.00,
    low24h: 781.00,
    volume: '3.1M',
    marketCap: '$745.8B',
    pe: 68.2,
    sector: 'Healthcare',
    country: 'United States',
    currency: 'USD',
    sparkline: generateSparkline(785.20, 20, false),
    technicalRating: 'Sell',
    oscillators: { rsi: 38.4, macd: '-6.2', stoch: '28.0', rating: 'Sell' },
    movingAverages: { ma20: 820.0, ma50: 860.0, ma200: 810.0, rating: 'Sell' },
    fundamentals: {
      prevClose: 797.60,
      open: 795.00,
      week52High: 972.53,
      week52Low: 565.40,
      avgVolume: '3.6M',
      dividendYield: '0.66%',
    }
  },
  {
    symbol: 'XOM',
    name: 'Exxon Mobil Corp.',
    category: 'stock',
    exchange: 'NYSE',
    price: 118.50,
    change: -0.90,
    changePercent: -0.75,
    high24h: 120.10,
    low24h: 118.00,
    volume: '15.4M',
    marketCap: '$468.2B',
    pe: 14.1,
    sector: 'Energy',
    country: 'United States',
    currency: 'USD',
    sparkline: generateSparkline(118.50, 20, false),
    technicalRating: 'Neutral',
    oscillators: { rsi: 46.2, macd: '-0.3', stoch: '42.0', rating: 'Neutral' },
    movingAverages: { ma20: 121.0, ma50: 119.5, ma200: 116.0, rating: 'Neutral' },
    fundamentals: {
      prevClose: 119.40,
      open: 119.80,
      week52High: 126.34,
      week52Low: 95.77,
      avgVolume: '17.2M',
      dividendYield: '3.34%',
    }
  },

  // CRYPTOCURRENCIES
  {
    symbol: 'BTCUSDT',
    name: 'Bitcoin / Tether',
    category: 'crypto',
    exchange: 'BINANCE',
    price: 88450.00,
    change: 3210.00,
    changePercent: 3.77,
    high24h: 89950.00,
    low24h: 85100.00,
    volume: '$48.2B',
    marketCap: '$1.75T',
    sector: 'Layer 1 Store of Value',
    currency: 'USD',
    sparkline: generateSparkline(88450, 20, true),
    technicalRating: 'Strong Buy',
    oscillators: { rsi: 74.2, macd: '+1840.0', stoch: '88.0', rating: 'Strong Buy' },
    movingAverages: { ma20: 81200.0, ma50: 72400.0, ma200: 64200.0, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 85240.00,
      open: 85300.00,
      week52High: 93480.00,
      week52Low: 38500.00,
      avgVolume: '$42.5B',
    }
  },
  {
    symbol: 'ETHUSDT',
    name: 'Ethereum / Tether',
    category: 'crypto',
    exchange: 'BINANCE',
    price: 3180.20,
    change: 85.40,
    changePercent: 2.76,
    high24h: 3240.00,
    low24h: 3080.50,
    volume: '$24.6B',
    marketCap: '$382.4B',
    sector: 'Smart Contracts L1',
    currency: 'USD',
    sparkline: generateSparkline(3180.20, 20, true),
    technicalRating: 'Buy',
    oscillators: { rsi: 65.1, macd: '+48.2', stoch: '76.0', rating: 'Buy' },
    movingAverages: { ma20: 2950.0, ma50: 2720.0, ma200: 2840.0, rating: 'Buy' },
    fundamentals: {
      prevClose: 3094.80,
      open: 3100.00,
      week52High: 4093.00,
      week52Low: 2110.00,
      avgVolume: '$21.0B',
    }
  },
  {
    symbol: 'SOLUSDT',
    name: 'Solana / Tether',
    category: 'crypto',
    exchange: 'BINANCE',
    price: 214.50,
    change: 14.20,
    changePercent: 7.09,
    high24h: 218.40,
    low24h: 198.20,
    volume: '$9.4B',
    marketCap: '$101.5B',
    sector: 'High Throughput L1',
    currency: 'USD',
    sparkline: generateSparkline(214.50, 20, true),
    technicalRating: 'Strong Buy',
    oscillators: { rsi: 76.5, macd: '+8.4', stoch: '89.0', rating: 'Strong Buy' },
    movingAverages: { ma20: 188.0, ma50: 165.0, ma200: 142.0, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 200.30,
      open: 201.00,
      week52High: 224.00,
      week52Low: 54.20,
      avgVolume: '$7.8B',
    }
  },
  {
    symbol: 'BNBUSDT',
    name: 'BNB / Tether',
    category: 'crypto',
    exchange: 'BINANCE',
    price: 638.10,
    change: 8.40,
    changePercent: 1.33,
    high24h: 645.00,
    low24h: 628.00,
    volume: '$1.8B',
    marketCap: '$92.4B',
    sector: 'Exchange Ecosystem',
    currency: 'USD',
    sparkline: generateSparkline(638.10, 20, true),
    technicalRating: 'Buy',
    oscillators: { rsi: 58.2, macd: '+4.2', stoch: '68.0', rating: 'Buy' },
    movingAverages: { ma20: 615.0, ma50: 590.0, ma200: 540.0, rating: 'Buy' },
    fundamentals: {
      prevClose: 629.70,
      open: 630.00,
      week52High: 720.67,
      week52Low: 232.00,
      avgVolume: '$1.6B',
    }
  },
  {
    symbol: 'XRPUSDT',
    name: 'XRP / Tether',
    category: 'crypto',
    exchange: 'BINANCE',
    price: 0.742,
    change: 0.084,
    changePercent: 12.76,
    high24h: 0.765,
    low24h: 0.650,
    volume: '$4.1B',
    marketCap: '$42.1B',
    sector: 'Payment & Remittance',
    currency: 'USD',
    sparkline: generateSparkline(0.742, 20, true),
    technicalRating: 'Strong Buy',
    oscillators: { rsi: 84.1, macd: '+0.038', stoch: '94.0', rating: 'Strong Buy' },
    movingAverages: { ma20: 0.620, ma50: 0.580, ma200: 0.540, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 0.658,
      open: 0.660,
      week52High: 0.765,
      week52Low: 0.432,
      avgVolume: '$2.1B',
    }
  },

  // FOREX
  {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    category: 'forex',
    exchange: 'FX_IDC',
    price: 1.0624,
    change: -0.0032,
    changePercent: -0.30,
    high24h: 1.0670,
    low24h: 1.0610,
    volume: '$140B',
    sparkline: generateSparkline(1.0624, 20, false),
    technicalRating: 'Strong Sell',
    sector: 'Major Forex',
    currency: 'USD',
    oscillators: { rsi: 32.4, macd: '-0.0042', stoch: '22.0', rating: 'Sell' },
    movingAverages: { ma20: 1.0740, ma50: 1.0860, ma200: 1.0880, rating: 'Strong Sell' },
    fundamentals: {
      prevClose: 1.0656,
      open: 1.0658,
      week52High: 1.1214,
      week52Low: 1.0598,
      avgVolume: '$150B',
    }
  },
  {
    symbol: 'USDJPY',
    name: 'US Dollar / Japanese Yen',
    category: 'forex',
    exchange: 'FX_IDC',
    price: 154.60,
    change: 0.95,
    changePercent: 0.62,
    high24h: 155.10,
    low24h: 153.50,
    volume: '$95B',
    sparkline: generateSparkline(154.60, 20, true),
    technicalRating: 'Strong Buy',
    sector: 'Major Forex',
    currency: 'JPY',
    oscillators: { rsi: 68.2, macd: '+0.85', stoch: '82.0', rating: 'Strong Buy' },
    movingAverages: { ma20: 152.4, ma50: 148.2, ma200: 151.0, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 153.65,
      open: 153.80,
      week52High: 161.95,
      week52Low: 140.25,
      avgVolume: '$90B',
    }
  },
  {
    symbol: 'GBPUSD',
    name: 'British Pound / US Dollar',
    category: 'forex',
    exchange: 'FX_IDC',
    price: 1.2740,
    change: -0.0055,
    changePercent: -0.43,
    high24h: 1.2815,
    low24h: 1.2720,
    volume: '$70B',
    sparkline: generateSparkline(1.2740, 20, false),
    technicalRating: 'Sell',
    sector: 'Major Forex',
    currency: 'USD',
    oscillators: { rsi: 36.8, macd: '-0.0035', stoch: '28.0', rating: 'Sell' },
    movingAverages: { ma20: 1.2890, ma50: 1.3020, ma200: 1.2820, rating: 'Sell' },
    fundamentals: {
      prevClose: 1.2795,
      open: 1.2800,
      week52High: 1.3434,
      week52Low: 1.2300,
      avgVolume: '$75B',
    }
  },

  // COMMODITIES & FUTURES
  {
    symbol: 'XAUUSD',
    name: 'Gold (Ounce)',
    category: 'commodity',
    exchange: 'COMEX',
    price: 2624.50,
    change: 18.20,
    changePercent: 0.70,
    high24h: 2638.00,
    low24h: 2605.00,
    volume: '$32.4B',
    sparkline: generateSparkline(2624.50, 20, true),
    technicalRating: 'Neutral',
    sector: 'Precious Metals',
    currency: 'USD',
    oscillators: { rsi: 52.4, macd: '+1.8', stoch: '54.0', rating: 'Neutral' },
    movingAverages: { ma20: 2660.0, ma50: 2640.0, ma200: 2420.0, rating: 'Buy' },
    fundamentals: {
      prevClose: 2606.30,
      open: 2610.00,
      week52High: 2790.15,
      week52Low: 1984.20,
      avgVolume: '$35.0B',
    }
  },
  {
    symbol: 'USOIL',
    name: 'Crude Oil (WTI)',
    category: 'commodity',
    exchange: 'NYMEX',
    price: 68.40,
    change: -1.25,
    changePercent: -1.79,
    high24h: 70.15,
    low24h: 67.90,
    volume: '$19.2B',
    sparkline: generateSparkline(68.40, 20, false),
    technicalRating: 'Strong Sell',
    sector: 'Energy',
    currency: 'USD',
    oscillators: { rsi: 35.1, macd: '-0.85', stoch: '24.0', rating: 'Strong Sell' },
    movingAverages: { ma20: 70.8, ma50: 72.4, ma200: 76.5, rating: 'Strong Sell' },
    fundamentals: {
      prevClose: 69.65,
      open: 69.80,
      week52High: 87.67,
      week52Low: 65.27,
      avgVolume: '$22.0B',
    }
  },
  {
    symbol: 'XAGUSD',
    name: 'Silver (Ounce)',
    category: 'commodity',
    exchange: 'COMEX',
    price: 30.85,
    change: 0.42,
    changePercent: 1.38,
    high24h: 31.20,
    low24h: 30.30,
    volume: '$8.2B',
    sparkline: generateSparkline(30.85, 20, true),
    technicalRating: 'Neutral',
    sector: 'Precious Metals',
    currency: 'USD',
    oscillators: { rsi: 48.0, macd: '+0.12', stoch: '50.0', rating: 'Neutral' },
    movingAverages: { ma20: 32.1, ma50: 31.4, ma200: 28.5, rating: 'Neutral' },
    fundamentals: {
      prevClose: 30.43,
      open: 30.50,
      week52High: 34.87,
      week52Low: 21.90,
      avgVolume: '$9.0B',
    }
  },

  // BONDS & YIELDS
  {
    symbol: 'US10Y',
    name: 'US 10-Year Treasury Yield',
    category: 'bond',
    exchange: 'US GOVERNMENT',
    price: 4.42,
    change: 0.05,
    changePercent: 1.14,
    high24h: 4.45,
    low24h: 4.36,
    volume: 'N/A',
    sparkline: generateSparkline(4.42, 20, true),
    technicalRating: 'Strong Buy',
    sector: 'Sovereign Debt',
    country: 'United States',
    currency: '%',
    oscillators: { rsi: 67.2, macd: '+0.04', stoch: '82.0', rating: 'Strong Buy' },
    movingAverages: { ma20: 4.32, ma50: 4.12, ma200: 4.22, rating: 'Strong Buy' },
    fundamentals: {
      prevClose: 4.37,
      open: 4.38,
      week52High: 4.74,
      week52Low: 3.60,
      avgVolume: 'N/A',
    }
  },
  {
    symbol: 'US02Y',
    name: 'US 2-Year Treasury Yield',
    category: 'bond',
    exchange: 'US GOVERNMENT',
    price: 4.34,
    change: 0.04,
    changePercent: 0.93,
    high24h: 4.36,
    low24h: 4.28,
    volume: 'N/A',
    sparkline: generateSparkline(4.34, 20, true),
    technicalRating: 'Buy',
    sector: 'Sovereign Debt',
    country: 'United States',
    currency: '%',
    oscillators: { rsi: 62.0, macd: '+0.03', stoch: '76.0', rating: 'Buy' },
    movingAverages: { ma20: 4.20, ma50: 4.05, ma200: 4.45, rating: 'Buy' },
    fundamentals: {
      prevClose: 4.30,
      open: 4.31,
      week52High: 5.04,
      week52Low: 3.55,
      avgVolume: 'N/A',
    }
  },
  {
    symbol: 'DE10Y',
    name: 'German 10-Year Bund Yield',
    category: 'bond',
    exchange: 'DEUTSCHE BUNDESBANK',
    price: 2.36,
    change: -0.02,
    changePercent: -0.84,
    high24h: 2.39,
    low24h: 2.34,
    volume: 'N/A',
    sparkline: generateSparkline(2.36, 20, false),
    technicalRating: 'Neutral',
    sector: 'Sovereign Debt',
    country: 'Germany',
    currency: '%',
    oscillators: { rsi: 48.0, macd: '-0.01', stoch: '44.0', rating: 'Neutral' },
    movingAverages: { ma20: 2.38, ma50: 2.32, ma200: 2.45, rating: 'Neutral' },
    fundamentals: {
      prevClose: 2.38,
      open: 2.38,
      week52High: 2.72,
      week52Low: 2.05,
      avgVolume: 'N/A',
    }
  }
];

export const S_P_500_HEATMAP: TreemapNode[] = [
  // Technology
  { symbol: 'NVDA', name: 'NVIDIA', marketCap: 3650, changePercent: 3.38, sector: 'Technology', price: 148.50 },
  { symbol: 'AAPL', name: 'Apple', marketCap: 3460, changePercent: 0.95, sector: 'Technology', price: 228.40 },
  { symbol: 'MSFT', name: 'Microsoft', marketCap: 3160, changePercent: -0.45, sector: 'Technology', price: 424.80 },
  { symbol: 'AVGO', name: 'Broadcom', marketCap: 830, changePercent: 2.15, sector: 'Technology', price: 178.40 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', marketCap: 230, changePercent: 1.80, sector: 'Technology', price: 142.60 },
  { symbol: 'CRM', name: 'Salesforce', marketCap: 310, changePercent: -1.20, sector: 'Technology', price: 318.50 },
  { symbol: 'PLTR', name: 'Palantir', marketCap: 140, changePercent: 7.03, sector: 'Technology', price: 62.40 },
  
  // Communication
  { symbol: 'GOOGL', name: 'Alphabet', marketCap: 2240, changePercent: 1.57, sector: 'Communication', price: 181.20 },
  { symbol: 'META', name: 'Meta', marketCap: 1500, changePercent: 1.46, sector: 'Communication', price: 592.10 },
  { symbol: 'NFLX', name: 'Netflix', marketCap: 350, changePercent: 2.40, sector: 'Communication', price: 820.30 },

  // Consumer Cyclical
  { symbol: 'AMZN', name: 'Amazon', marketCap: 2190, changePercent: 1.91, sector: 'Consumer Cyclical', price: 208.50 },
  { symbol: 'TSLA', name: 'Tesla', marketCap: 1080, changePercent: 5.67, sector: 'Consumer Cyclical', price: 338.90 },
  { symbol: 'HD', name: 'Home Depot', marketCap: 395, changePercent: -0.85, sector: 'Consumer Cyclical', price: 398.20 },

  // Financial
  { symbol: 'JPM', name: 'JPMorgan Chase', marketCap: 688, changePercent: 1.42, sector: 'Financial', price: 242.10 },
  { symbol: 'V', name: 'Visa', marketCap: 605, changePercent: 0.65, sector: 'Financial', price: 308.40 },
  { symbol: 'MA', name: 'Mastercard', marketCap: 480, changePercent: 0.52, sector: 'Financial', price: 518.20 },
  { symbol: 'BAC', name: 'Bank of America', marketCap: 360, changePercent: 1.85, sector: 'Financial', price: 46.20 },
  { symbol: 'WFC', name: 'Wells Fargo', marketCap: 245, changePercent: 2.10, sector: 'Financial', price: 71.80 },

  // Healthcare
  { symbol: 'LLY', name: 'Eli Lilly', marketCap: 745, changePercent: -1.55, sector: 'Healthcare', price: 785.20 },
  { symbol: 'UNH', name: 'UnitedHealth', marketCap: 540, changePercent: 0.35, sector: 'Healthcare', price: 592.40 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', marketCap: 375, changePercent: -0.40, sector: 'Healthcare', price: 156.20 },
  { symbol: 'ABBV', name: 'AbbVie', marketCap: 310, changePercent: -0.92, sector: 'Healthcare', price: 174.50 },

  // Energy
  { symbol: 'XOM', name: 'Exxon Mobil', marketCap: 468, changePercent: -0.75, sector: 'Energy', price: 118.50 },
  { symbol: 'CVX', name: 'Chevron', marketCap: 290, changePercent: -1.10, sector: 'Energy', price: 158.40 },

  // Consumer Defensive
  { symbol: 'WMT', name: 'Walmart', marketCap: 675, changePercent: 0.85, sector: 'Consumer Defensive', price: 84.60 },
  { symbol: 'COST', name: 'Costco', marketCap: 415, changePercent: 1.15, sector: 'Consumer Defensive', price: 935.00 },
  { symbol: 'PG', name: 'Procter & Gamble', marketCap: 390, changePercent: -0.30, sector: 'Consumer Defensive', price: 168.20 },

  // Industrials
  { symbol: 'GE', name: 'GE Aerospace', marketCap: 195, changePercent: 1.75, sector: 'Industrials', price: 182.40 },
  { symbol: 'CAT', name: 'Caterpillar', marketCap: 185, changePercent: 0.90, sector: 'Industrials', price: 395.20 },
  { symbol: 'BA', name: 'Boeing', marketCap: 88, changePercent: -2.40, sector: 'Industrials', price: 142.10 }
];

export const CRYPTO_HEATMAP: TreemapNode[] = [
  { symbol: 'BTC', name: 'Bitcoin', marketCap: 1750, changePercent: 3.77, sector: 'Store of Value', price: 88450 },
  { symbol: 'ETH', name: 'Ethereum', marketCap: 382, changePercent: 2.76, sector: 'Smart Contracts', price: 3180 },
  { symbol: 'SOL', name: 'Solana', marketCap: 101, changePercent: 7.09, sector: 'High Speed L1', price: 214.50 },
  { symbol: 'BNB', name: 'BNB', marketCap: 92, changePercent: 1.33, sector: 'Exchange', price: 638.10 },
  { symbol: 'XRP', name: 'XRP', marketCap: 42, changePercent: 12.76, sector: 'Payments', price: 0.742 },
  { symbol: 'DOGE', name: 'Dogecoin', marketCap: 56, changePercent: 8.45, sector: 'Meme / Culture', price: 0.384 },
  { symbol: 'ADA', name: 'Cardano', marketCap: 20, changePercent: 4.80, sector: 'PoS L1', price: 0.582 },
  { symbol: 'AVAX', name: 'Avalanche', marketCap: 14, changePercent: 3.20, sector: 'Subnets L1', price: 34.80 },
  { symbol: 'SUI', name: 'Sui Network', marketCap: 9.8, changePercent: 15.20, sector: 'Move L1', price: 3.25 },
  { symbol: 'LINK', name: 'Chainlink', marketCap: 8.9, changePercent: 2.10, sector: 'Oracle Infrastructure', price: 14.60 }
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'n-1',
    title: 'NVIDIA and Hyperscalers Accelerate AI Server Deployments as Q4 Demand Surges',
    source: 'Bloomberg Markets',
    timeAgo: '18m ago',
    category: 'stocks',
    relatedSymbols: ['NVDA', 'MSFT', 'AMZN'],
    summary: 'Cloud providers increase capital expenditure plans heading into the new fiscal year, citing unconstrained enterprise AI workload requirements and next-gen Blackwell platform volume production.',
    readTime: '3 min read',
    sentiment: 'positive',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'n-2',
    title: 'Bitcoin Crosses $88,000 Mark as Spot ETF Inflows Reach Historic Weekly Milestones',
    source: 'TradingView News',
    timeAgo: '42m ago',
    category: 'crypto',
    relatedSymbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
    summary: 'Institutional net accumulations top $1.2B in a single session, driving total crypto market cap beyond $2.75T while open interest sets all-time highs across derivatives venues.',
    readTime: '4 min read',
    sentiment: 'positive',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'n-3',
    title: 'US 10-Year Treasury Yield Holds Above 4.40% Ahead of Fed Monetary Policy Remarks',
    source: 'Reuters Financial',
    timeAgo: '1h ago',
    category: 'macro',
    relatedSymbols: ['US10Y', 'SPX', 'EURUSD'],
    summary: 'Bond traders price in a tempered pace of rate reductions into 2025 as retail sales resilience and sticky core CPI readings keep benchmark yields elevated.',
    readTime: '5 min read',
    sentiment: 'neutral',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'n-4',
    title: 'Crude Oil Pressured by Rising Global Inventories and Stronger US Dollar Dynamics',
    source: 'CNBC Energy Wire',
    timeAgo: '2h ago',
    category: 'macro',
    relatedSymbols: ['USOIL', 'XOM'],
    summary: 'WTI slips below $69 a barrel as the US Dollar Index maintains upside momentum and IEA forecasts project an expanding supply cushion throughout the coming quarter.',
    readTime: '3 min read',
    sentiment: 'negative',
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'n-5',
    title: 'Euro Weakens Against Dollar as ECB Officials Signal Readiness for Continued Easing',
    source: 'Financial Times',
    timeAgo: '3h ago',
    category: 'forex',
    relatedSymbols: ['EURUSD', 'DAX'],
    summary: 'EUR/USD tests key support near 1.0600 following regional manufacturing PMI readings that underscore growth divergence between Europe and the United States.',
    readTime: '4 min read',
    sentiment: 'negative',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'n-6',
    title: 'S&P 500 Records Fresh Highs Led by Tech and Small-Cap Russell 2000 Breadth',
    source: 'Wall Street Journal',
    timeAgo: '4h ago',
    category: 'stocks',
    relatedSymbols: ['SPX', 'RUT', 'NDX'],
    summary: 'Broad market participation deepens as market breadth indicators reflect expanding participation beyond mega-cap names into cyclicals and domestic industrials.',
    readTime: '5 min read',
    sentiment: 'positive',
    imageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80'
  }
];

export const ECONOMIC_CALENDAR: EconomicEvent[] = [
  {
    id: 'e-1',
    time: '08:30 EST',
    country: 'United States',
    countryCode: 'US',
    event: 'Core CPI (MoM)',
    impact: 'high',
    actual: '0.3%',
    forecast: '0.3%',
    previous: '0.3%'
  },
  {
    id: 'e-2',
    time: '10:00 EST',
    country: 'United States',
    countryCode: 'US',
    event: 'University of Michigan Consumer Sentiment',
    impact: 'medium',
    actual: '73.0',
    forecast: '71.0',
    previous: '70.5'
  },
  {
    id: 'e-3',
    time: '14:00 EST',
    country: 'United States',
    countryCode: 'US',
    event: 'Fed Chair Speech & Economic Outlook',
    impact: 'high',
    forecast: 'Rate path guidance',
  },
  {
    id: 'e-4',
    time: '03:00 GMT',
    country: 'Germany',
    countryCode: 'DE',
    event: 'ZEW Economic Sentiment Index',
    impact: 'medium',
    actual: '12.5',
    forecast: '13.0',
    previous: '13.1'
  },
  {
    id: 'e-5',
    time: '23:50 JST',
    country: 'Japan',
    countryCode: 'JP',
    event: 'GDP Growth Annualized (QoQ)',
    impact: 'high',
    actual: '0.9%',
    forecast: '0.7%',
    previous: '2.9%'
  }
];

export const CURRENCY_CROSS_RATES = [
  { base: 'USD', EUR: 0.9412, JPY: 154.60, GBP: 0.7849, CHF: 0.8812, AUD: 1.5313, CAD: 1.3980 },
  { base: 'EUR', USD: 1.0624, JPY: 164.25, GBP: 0.8338, CHF: 0.9362, AUD: 1.6268, CAD: 1.4852 },
  { base: 'GBP', USD: 1.2740, EUR: 1.1993, JPY: 196.96, CHF: 1.1228, AUD: 1.9509, CAD: 1.7810 },
  { base: 'JPY', USD: 0.00647, EUR: 0.00609, GBP: 0.00508, CHF: 0.00570, AUD: 0.00990, CAD: 0.00904 }
];
