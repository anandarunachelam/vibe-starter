export type MarketTab = 
  | 'overview' 
  | 'stocks' 
  | 'crypto' 
  | 'forex' 
  | 'indices' 
  | 'futures' 
  | 'bonds' 
  | 'heatmap' 
  | 'screener' 
  | 'news';

export type AssetCategory = 'stock' | 'crypto' | 'forex' | 'index' | 'commodity' | 'bond';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface SymbolData {
  symbol: string;
  name: string;
  category: AssetCategory;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  marketCap?: string;
  pe?: number;
  sector?: string;
  country?: string;
  currency?: string;
  sparkline: number[];
  technicalRating: TechnicalRating;
  oscillators: {
    rsi: number;
    macd: string;
    stoch: string;
    rating: TechnicalRating;
  };
  movingAverages: {
    ma20: number;
    ma50: number;
    ma200: number;
    rating: TechnicalRating;
  };
  fundamentals?: {
    prevClose: number;
    open: number;
    week52High: number;
    week52Low: number;
    avgVolume: string;
    beta?: number;
    dividendYield?: string;
    nextEarnings?: string;
  };
  candles?: CandleData[];
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: 'all' | 'stocks' | 'crypto' | 'macro' | 'forex';
  relatedSymbols: string[];
  summary: string;
  readTime: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  imageUrl?: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  countryCode: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export interface TreemapNode {
  symbol: string;
  name: string;
  marketCap: number; // in billions
  changePercent: number;
  sector: string;
  price: number;
}
