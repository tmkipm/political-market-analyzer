'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Activity, Calendar, AlertCircle } from 'lucide-react';
import RealTimeData from '@/components/RealTimeData';
import PredictiveModel from '@/components/PredictiveModel';
import HistoricalTimeline from '@/components/HistoricalTimeline';
import CorrelationAnalysis from '@/components/CorrelationAnalysis';

export default function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');


  const mockUpcomingEvents = [
    { date: '2024-09-18', event: 'Fed Meeting', impact: 'high', alignment: 'neutral' },
    { date: '2024-10-15', event: 'Healthcare Policy Vote', impact: 'critical', alignment: 'left' },
    { date: '2024-11-05', event: 'Presidential Election', impact: 'critical', alignment: 'neutral' },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">
                Political Market Impact Analyzer
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Real-time analysis of how political events influence market movements
              </p>
            </div>
            
            {/* API Usage Status */}
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-50 border-green-200">
                <Activity className="w-3 h-3 mr-1" />
                Twelve Data: 5/800
              </Badge>
              <Badge variant="outline" className="bg-green-50 border-green-200">
                <Activity className="w-3 h-3 mr-1" />
                Alpha Vantage: 2/500
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe} className="space-y-6">
          {/* Time Period Selector */}
          <TabsList className="grid w-full grid-cols-5 max-w-md">
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="3M">3M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTimeframe} className="space-y-6">
            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Political Risk Level</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">High</div>
                  <p className="text-xs text-muted-foreground">
                    Upcoming election + policy uncertainty
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-600">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
                  <TrendingDown className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Mixed</div>
                  <p className="text-xs text-muted-foreground">
                    -0.2% avg sector performance
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-600">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Positioned</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">Energy</div>
                  <p className="text-xs text-muted-foreground">
                    +4.1% with pro-industry policies
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Real-Time Sector Analysis */}
            <RealTimeData selectedTimeframe={selectedTimeframe} />

            {/* AI Predictive Model */}
            <PredictiveModel selectedTimeframe={selectedTimeframe} />

            {/* Historical Timeline & Analysis */}
            <HistoricalTimeline selectedTimeframe={selectedTimeframe} />

            {/* Statistical Correlation Analysis */}
            <CorrelationAnalysis selectedTimeframe={selectedTimeframe} />

            {/* Political Events Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Political Events & Market Impact
                </CardTitle>
                <CardDescription>
                  Predicted market reactions to scheduled political events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUpcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div>
                        <div className="font-semibold">{event.event}</div>
                        <div className="text-sm text-gray-600">{event.date}</div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={event.impact === 'critical' ? 'destructive' : 'secondary'}>
                          {event.impact} impact
                        </Badge>
                        <Badge variant="outline">
                          {event.alignment}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Development Status */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-100 dark:from-green-900/20 dark:to-blue-800/20 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-300">
                  🚀 Enhanced Political Market Analyzer - V2.0!
                </CardTitle>
                <CardDescription>
                  Advanced analytics, historical backtesting, and expanded market coverage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold text-green-800">Core Features</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>✅ Real-time market data (Alpha Vantage, Twelve Data)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>✅ AI predictive modeling with confidence scoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>✅ Political event classification (left/right/center)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>✅ Rate limiting & API optimization</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold text-green-800">New Enhancements</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>🆕 Historical backtesting (2020-2024 events)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>🆕 Interactive timeline with Recharts visualization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>🆕 Statistical correlation analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>🆕 Expanded sectors (crypto, commodities, international)</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-green-100 border border-green-300 rounded-md">
                    <p className="text-sm text-green-800 font-medium">
                      📊 <strong>12 Historical Events:</strong> Real 2020-2024 political events with actual market impact data
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 border border-blue-300 rounded-md">
                    <p className="text-sm text-blue-800 font-medium">
                      🎯 <strong>12 Market Sectors:</strong> Traditional + Crypto, Commodities, Cannabis, Real Estate
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 border border-purple-300 rounded-md">
                    <p className="text-sm text-purple-800 font-medium">
                      📈 <strong>Advanced Analytics:</strong> Interactive charts, correlation analysis, performance tracking
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}