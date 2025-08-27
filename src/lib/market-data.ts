// Market Data Functions for Political Market Analyzer
import { fetchTwelveData } from './api-clients';

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Key political-sensitive stocks and sectors
export const POLITICAL_STOCKS = {
  // Healthcare - sensitive to healthcare policy
  healthcare: ['UNH', 'JNJ', 'PFE', 'ABBV', 'MRK'],
  
  // Energy - sensitive to environmental/energy policy
  energy: ['XOM', 'CVX', 'COP', 'SLB', 'MPC'],
  
  // Defense - sensitive to foreign policy/defense spending
  defense: ['LMT', 'RTX', 'BA', 'NOC', 'GD'],
  
  // Financial - sensitive to regulatory policy
  financial: ['JPM', 'BAC', 'WFC', 'GS', 'MS'],
  
  // Tech - sensitive to antitrust/tech regulation
  tech: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'],
  
  // Infrastructure - sensitive to infrastructure spending
  infrastructure: ['CAT', 'DE', 'UNP', 'CSX', 'NSC'],
  
  // Market indices
  indices: ['^GSPC', '^DJI', '^IXIC'] // S&P 500, Dow, Nasdaq
};

// Fetch current stock prices
export const fetchStockData = async (symbols: string[]): Promise<StockData[]> => {
  const results: StockData[] = [];
  
  try {
    // Use Twelve Data for real-time quotes (primary)
    for (const symbol of symbols.slice(0, 10)) { // Limit to avoid hitting rate limits
      try {
        const data = await fetchTwelveData('/price', {
          symbol: symbol,
          interval: '1day'
        });
        
        if (data && data.price) {
          results.push({
            symbol: symbol,
            price: parseFloat(data.price),
            change: 0, // Will be calculated from historical data
            changePercent: 0,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.log(`Failed to fetch ${symbol} from Twelve Data:`, error);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
};

// Fetch historical data for correlation analysis
export const fetchHistoricalData = async (
  symbol: string, 
  interval: string = '1day',
  outputsize: number = 100
): Promise<HistoricalData[]> => {
  try {
    // Try Twelve Data first
    const data = await fetchTwelveData('/time_series', {
      symbol: symbol,
      interval: interval,
      outputsize: outputsize.toString()
    });
    
    if (data && data.values) {
      return data.values.map((item: Record<string, string>) => ({
        date: item.datetime,
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
        volume: parseInt(item.volume)
      }));
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    return [];
  }
};

// Get sector performance for political analysis
export const getSectorPerformance = async () => {
  const sectorData: Record<string, { stocks: StockData[], avgChange: number, sentiment: string }> = {};
  
  try {
    // Fetch representative stocks from each political sector
    for (const [sector, symbols] of Object.entries(POLITICAL_STOCKS)) {
      if (sector === 'indices') continue; // Skip indices for sector analysis
      
      const sectorStocks = await fetchStockData(symbols.slice(0, 3)); // Limit to 3 stocks per sector
      const avgChange = sectorStocks.reduce((sum, stock) => sum + stock.changePercent, 0) / sectorStocks.length;
      
      sectorData[sector] = {
        stocks: sectorStocks,
        avgChange: avgChange,
        sentiment: avgChange > 0 ? 'positive' : 'negative'
      };
    }
    
    return sectorData;
  } catch (error) {
    console.error('Error fetching sector performance:', error);
    return {};
  }
};

// Calculate correlation between political events and stock movements
export const calculatePoliticalCorrelation = (
  stockData: HistoricalData[],
  politicalEvents: Record<string, unknown>[]
): number => {
  // Simplified correlation calculation
  // In a real implementation, we'd use more sophisticated statistical methods
  
  if (!stockData.length || !politicalEvents.length) return 0;
  
  // This is a placeholder for correlation calculation
  // We'll implement proper correlation analysis later
  return Math.random() * 0.8 - 0.4; // Random correlation between -0.4 and 0.4
};

// Development logging for blog post
export const logMarketDataCall = (
  endpoint: string, 
  symbol: string, 
  success: boolean,
  apiUsed: string
) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    endpoint,
    symbol,
    success,
    apiUsed,
    type: 'market-data-call'
  };
  
  console.log('📊 Market Data Call:', logEntry);
  
  // In production, we'd save this to a file or database for the blog post
  if (typeof window !== 'undefined') {
    const logs = JSON.parse(localStorage.getItem('dev-logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('dev-logs', JSON.stringify(logs.slice(-100))); // Keep last 100 logs
  }
};