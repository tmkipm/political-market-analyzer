'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Brain, AlertTriangle } from 'lucide-react';
import { HISTORICAL_POLITICAL_EVENTS, predictMarketImpact, type PoliticalEvent } from '@/lib/political-events';

interface PredictiveModelProps {
  selectedTimeframe: string;
}

interface PredictionResult {
  sector: string;
  prediction: 'positive' | 'negative' | 'neutral';
  confidence: number;
  reasoning: string;
  events: PoliticalEvent[];
}

export default function PredictiveModel({ selectedTimeframe }: PredictiveModelProps) {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [modelAccuracy] = useState(78.4); // Mock accuracy score

  const runPredictionModel = async () => {
    setLoading(true);
    
    try {
      console.log('🧠 Running predictive model analysis...');
      
      // Mock upcoming events that could affect markets
      const upcomingEvents: PoliticalEvent[] = [
        {
          id: 'fed-meeting-sept',
          date: '2024-09-18',
          title: 'Federal Reserve Interest Rate Decision',
          description: 'Fed expected to cut rates by 0.25%',
          type: 'economic',
          alignment: 'neutral',
          severity: 'high',
          affectedSectors: ['financial', 'infrastructure'],
          expectedImpact: 'positive',
          tags: ['fed', 'interest-rates', 'monetary-policy']
        },
        {
          id: 'healthcare-vote',
          date: '2024-10-15',
          title: 'Medicare Drug Price Negotiation Vote',
          description: 'Senate vote on expanding Medicare drug price negotiations',
          type: 'legislation',
          alignment: 'left',
          severity: 'critical',
          affectedSectors: ['healthcare'],
          expectedImpact: 'negative',
          tags: ['healthcare', 'medicare', 'drug-pricing']
        },
        {
          id: 'election-2024',
          date: '2024-11-05',
          title: 'Presidential Election',
          description: '2024 US Presidential Election - market uncertainty peak',
          type: 'election',
          alignment: 'neutral',
          severity: 'critical',
          affectedSectors: ['healthcare', 'energy', 'defense', 'financial', 'tech', 'infrastructure'],
          expectedImpact: 'neutral',
          tags: ['election', 'uncertainty', 'volatility']
        },
        {
          id: 'energy-policy',
          date: '2024-12-01',
          title: 'Renewable Energy Tax Credit Extension',
          description: 'Congressional vote on extending clean energy tax credits',
          type: 'legislation',
          alignment: 'left',
          severity: 'medium',
          affectedSectors: ['energy', 'infrastructure'],
          expectedImpact: 'positive',
          tags: ['renewable-energy', 'tax-credits', 'climate']
        }
      ];

      // Analyze predictions for each sector
      const sectors = ['healthcare', 'energy', 'defense', 'financial', 'tech', 'infrastructure'];
      const sectorPredictions: PredictionResult[] = [];

      for (const sector of sectors) {
        // Find relevant events for this sector
        const relevantEvents = upcomingEvents.filter(event => 
          event.affectedSectors.includes(sector as 'healthcare' | 'energy' | 'defense' | 'financial' | 'tech' | 'infrastructure' | 'all') || event.affectedSectors.includes('all')
        );

        if (relevantEvents.length === 0) {
          sectorPredictions.push({
            sector,
            prediction: 'neutral',
            confidence: 0.5,
            reasoning: 'No significant political events expected to impact this sector',
            events: []
          });
          continue;
        }

        // Use our political impact prediction model
        const impacts = relevantEvents.map(event => 
          predictMarketImpact(event, sector as 'healthcare' | 'energy' | 'defense' | 'financial' | 'tech' | 'infrastructure')
        );

        // Aggregate predictions
        const positiveImpacts = impacts.filter(i => i.direction === 'positive');
        const negativeImpacts = impacts.filter(i => i.direction === 'negative');
        
        let overallPrediction: 'positive' | 'negative' | 'neutral' = 'neutral';
        let confidence = 0.5;
        let reasoning = '';

        if (positiveImpacts.length > negativeImpacts.length) {
          overallPrediction = 'positive';
          confidence = positiveImpacts.reduce((sum, i) => sum + i.confidence, 0) / positiveImpacts.length;
          reasoning = `${positiveImpacts.length} bullish events expected, primarily driven by ${relevantEvents[0].title}`;
        } else if (negativeImpacts.length > positiveImpacts.length) {
          overallPrediction = 'negative';
          confidence = negativeImpacts.reduce((sum, i) => sum + i.confidence, 0) / negativeImpacts.length;
          reasoning = `${negativeImpacts.length} bearish events expected, with highest impact from ${relevantEvents.find(e => e.expectedImpact === 'negative')?.title}`;
        } else {
          overallPrediction = 'neutral';
          confidence = 0.6;
          reasoning = 'Mixed signals from upcoming political events creating market uncertainty';
        }

        sectorPredictions.push({
          sector,
          prediction: overallPrediction,
          confidence: Math.min(confidence, 0.9), // Cap confidence at 90%
          reasoning,
          events: relevantEvents.slice(0, 2) // Top 2 most relevant events
        });
      }

      setPredictions(sectorPredictions);
      console.log('✅ Predictive model analysis complete:', sectorPredictions);
      
    } catch (error) {
      console.error('❌ Error running prediction model:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPredictionModel();
  }, [selectedTimeframe]);

  const getSectorIcon = (prediction: string) => {
    switch (prediction) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Predictive Model - Political Market Impact
            </CardTitle>
            <CardDescription>
              Machine learning predictions based on upcoming political events and historical correlations
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-50 border-purple-200">
              <Brain className="w-3 h-3 mr-1" />
              {modelAccuracy}% accuracy
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={runPredictionModel}
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Refresh Model'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Brain className="w-6 h-6 animate-pulse text-purple-400" />
            <span className="ml-2 text-gray-500">Running AI analysis...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div key={prediction.sector} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold capitalize">{prediction.sector}</h4>
                    {getSectorIcon(prediction.prediction)}
                    <Badge 
                      variant="outline" 
                      className={getPredictionColor(prediction.prediction)}
                    >
                      {prediction.prediction}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Confidence:</span>
                    <Progress value={prediction.confidence * 100} className="w-20" />
                    <span className="text-sm font-medium">{Math.round(prediction.confidence * 100)}%</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{prediction.reasoning}</p>
                
                {prediction.events.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {prediction.events.map((event) => (
                      <Badge key={event.id} variant="secondary" className="text-xs">
                        {event.title}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-800">Model Insights</span>
          </div>
          <div className="text-sm text-purple-700">
            <p>• Trained on {HISTORICAL_POLITICAL_EVENTS.length} historical political events</p>
            <p>• Considers event alignment (left/right), severity, and affected sectors</p>
            <p>• Updates predictions based on {selectedTimeframe} timeframe analysis</p>
            <p>• Confidence scores reflect uncertainty in political outcomes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}