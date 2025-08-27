// API Clients for Political Market Analyzer
import axios from 'axios';

// Rate limiting tracker
const apiCallTracker = {
  alphaVantage: { count: 0, resetTime: new Date().setHours(24, 0, 0, 0) },
  twelveData: { count: 0, resetTime: new Date().setHours(24, 0, 0, 0) }
};

// Check and update rate limits
const canMakeCall = (service: 'alphaVantage' | 'twelveData'): boolean => {
  const now = Date.now();
  const tracker = apiCallTracker[service];
  
  // Reset counter if new day
  if (now > tracker.resetTime) {
    tracker.count = 0;
    tracker.resetTime = new Date().setHours(24, 0, 0, 0);
  }
  
  const limits = {
    alphaVantage: 500,
    twelveData: 800
  };
  
  return tracker.count < limits[service];
};

const incrementCall = (service: 'alphaVantage' | 'twelveData') => {
  apiCallTracker[service].count++;
  console.log(`${service} calls used today: ${apiCallTracker[service].count}`);
};

// Alpha Vantage API client
export const alphaVantageClient = axios.create({
  baseURL: 'https://www.alphavantage.co/query',
  timeout: 10000,
});

// Twelve Data API client  
export const twelveDataClient = axios.create({
  baseURL: 'https://api.twelvedata.com',
  timeout: 10000,
});

// Alpha Vantage wrapper with rate limiting
export const fetchAlphaVantage = async (params: Record<string, string>) => {
  if (!canMakeCall('alphaVantage')) {
    throw new Error('Alpha Vantage daily limit reached');
  }
  
  incrementCall('alphaVantage');
  
  const response = await alphaVantageClient.get('', {
    params: {
      ...params,
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
    },
  });
  
  return response.data;
};

// Twelve Data wrapper with rate limiting
export const fetchTwelveData = async (endpoint: string, params: Record<string, string> = {}) => {
  if (!canMakeCall('twelveData')) {
    throw new Error('Twelve Data daily limit reached');
  }
  
  incrementCall('twelveData');
  
  const response = await twelveDataClient.get(endpoint, {
    params: {
      ...params,
      apikey: process.env.TWELVE_DATA_API_KEY,
    },
  });
  
  return response.data;
};

// YFinance fallback (unlimited)
export const fetchYahooFinance = async (symbol: string, period: string = '1y') => {
  // Note: In production, we'd use a proper YFinance API or library
  // For now, we'll create a placeholder that can be replaced
  console.log(`YFinance fallback for ${symbol} - ${period}`);
  return { note: 'YFinance implementation needed' };
};

// Export rate limiting status for dashboard
export const getApiStatus = () => ({
  alphaVantage: {
    used: apiCallTracker.alphaVantage.count,
    limit: 500,
    remaining: 500 - apiCallTracker.alphaVantage.count
  },
  twelveData: {
    used: apiCallTracker.twelveData.count,
    limit: 800,
    remaining: 800 - apiCallTracker.twelveData.count
  }
});