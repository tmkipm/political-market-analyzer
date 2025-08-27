'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { HISTORICAL_POLITICAL_EVENTS } from '@/lib/political-events';
import { format, parseISO } from 'date-fns';

interface HistoricalTimelineProps {
  selectedTimeframe: string;
}

interface TimelineDataPoint {
  date: string;
  eventTitle: string;
  expectedImpact: number;
  actualImpact: number;
  alignment: string;
  severity: string;
  cumulativeImpact: number;
}

export default function HistoricalTimeline({ selectedTimeframe }: HistoricalTimelineProps) {
  const [timelineData, setTimelineData] = useState<TimelineDataPoint[]>([]);
  const [selectedAlignment, setSelectedAlignment] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const processTimelineData = () => {
    setLoading(true);
    
    // Filter events based on timeframe
    const now = new Date();
    const filteredEvents = HISTORICAL_POLITICAL_EVENTS.filter(event => {
      const eventDate = parseISO(event.date);
      const monthsBack = selectedTimeframe === '1Y' ? 12 : 
                        selectedTimeframe === '3M' ? 3 :
                        selectedTimeframe === '1M' ? 1 : 48; // Default to 4 years
      
      const cutoffDate = new Date(now);
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);
      
      return eventDate >= cutoffDate;
    });

    // Filter by political alignment if selected
    const alignmentFiltered = selectedAlignment === 'all' ? 
      filteredEvents : 
      filteredEvents.filter(event => event.alignment === selectedAlignment);

    // Process data for chart
    let cumulativeImpact = 0;
    const processedData = alignmentFiltered
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(event => {
        const expectedImpact = event.expectedImpact === 'positive' ? 5 : 
                             event.expectedImpact === 'negative' ? -5 : 0;
        const actualImpact = (event.actualImpact || 0) * 100; // Convert to percentage
        
        cumulativeImpact += actualImpact;
        
        return {
          date: event.date,
          eventTitle: event.title,
          expectedImpact,
          actualImpact,
          alignment: event.alignment,
          severity: event.severity,
          cumulativeImpact
        };
      });

    setTimelineData(processedData);
    setLoading(false);
  };

  useEffect(() => {
    processTimelineData();
  }, [selectedTimeframe, selectedAlignment]);

  const alignmentColors = {
    left: '#3b82f6',
    right: '#ef4444', 
    neutral: '#6b7280',
    center: '#10b981'
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any[], label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.eventTitle}</p>
          <p className="text-sm text-gray-600">{format(parseISO(data.date), 'MMM dd, yyyy')}</p>
          <p className="text-sm">
            <span className="font-medium">Actual Impact:</span> {data.actualImpact.toFixed(2)}%
          </p>
          <p className="text-sm">
            <span className="font-medium">Cumulative:</span> {data.cumulativeImpact.toFixed(2)}%
          </p>
          <Badge className={`text-xs ${
            data.alignment === 'left' ? 'bg-blue-100 text-blue-800' :
            data.alignment === 'right' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {data.alignment} • {data.severity}
          </Badge>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Historical Political Events & Market Impact
            </CardTitle>
            <CardDescription>
              Interactive timeline showing actual vs expected market reactions to political events (2020-2024)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 border-green-200">
              <Activity className="w-3 h-3 mr-1" />
              {timelineData.length} events
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'left', 'right', 'neutral'].map((alignment) => (
            <Button
              key={alignment}
              variant={selectedAlignment === alignment ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedAlignment(alignment)}
              className="capitalize"
            >
              {alignment === 'all' ? 'All Events' : `${alignment}-wing`}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Activity className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading timeline data...</span>
          </div>
        ) : (
          <>
            {/* Interactive Chart */}
            <div className="h-80 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(parseISO(date), 'MMM yy')}
                    stroke="#666"
                  />
                  <YAxis 
                    label={{ value: 'Market Impact (%)', angle: -90, position: 'insideLeft' }}
                    stroke="#666"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
                  
                  {/* Actual Impact Line */}
                  <Line 
                    type="monotone" 
                    dataKey="actualImpact" 
                    stroke="#004d25" 
                    strokeWidth={2}
                    dot={{ fill: '#004d25', r: 4 }}
                    name="Actual Impact"
                  />
                  
                  {/* Cumulative Impact Line */}
                  <Line 
                    type="monotone" 
                    dataKey="cumulativeImpact" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#10b981', r: 3 }}
                    name="Cumulative Impact"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Event Details */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Recent Events Detail</h4>
              {timelineData.slice(-5).reverse().map((event) => (
                <div key={event.date} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{event.eventTitle}</span>
                      <Badge className={`text-xs ${
                        event.alignment === 'left' ? 'bg-blue-100 text-blue-800' :
                        event.alignment === 'right' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.alignment}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{format(parseISO(event.date), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {event.actualImpact > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      event.actualImpact >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {event.actualImpact >= 0 ? '+' : ''}{event.actualImpact.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Model Performance Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Model Performance Insights</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>• Historical accuracy: {((timelineData.filter(e => Math.sign(e.actualImpact) === Math.sign(e.expectedImpact)).length / timelineData.length) * 100).toFixed(1)}% direction prediction</p>
                <p>• Average absolute impact: {(timelineData.reduce((sum, e) => sum + Math.abs(e.actualImpact), 0) / timelineData.length).toFixed(2)}% per event</p>
                <p>• {selectedAlignment === 'all' ? 'All political alignments' : `${selectedAlignment.charAt(0).toUpperCase() + selectedAlignment.slice(1)}-wing events`} shown for {selectedTimeframe} timeframe</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}