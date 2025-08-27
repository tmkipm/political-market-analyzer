// Political Events Classification and Data for Market Analysis

export type PoliticalAlignment = 'left' | 'right' | 'center' | 'neutral';
export type EventType = 'election' | 'policy' | 'speech' | 'legislation' | 'appointment' | 'economic';
export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';
export type MarketSector = 'healthcare' | 'energy' | 'defense' | 'financial' | 'tech' | 'infrastructure' | 'all';

export interface PoliticalEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: EventType;
  alignment: PoliticalAlignment;
  severity: EventSeverity;
  affectedSectors: MarketSector[];
  expectedImpact: 'positive' | 'negative' | 'neutral';
  actualImpact?: number; // Calculated after event
  tags: string[];
}

// Historical political events for training our model
export const HISTORICAL_POLITICAL_EVENTS: PoliticalEvent[] = [
  {
    id: '2024-election-biden-announce',
    date: '2024-01-15',
    title: 'Biden Announces Infrastructure Bill Extension',
    description: 'President Biden announces $500B extension to infrastructure spending',
    type: 'policy',
    alignment: 'left',
    severity: 'high',
    affectedSectors: ['infrastructure', 'energy'],
    expectedImpact: 'positive',
    tags: ['infrastructure', 'spending', 'green-energy']
  },
  {
    id: '2024-fed-rate-decision',
    date: '2024-03-20',
    title: 'Federal Reserve Rate Decision',
    description: 'Fed announces 0.25% interest rate cut',
    type: 'economic',
    alignment: 'neutral',
    severity: 'high',
    affectedSectors: ['financial', 'all'],
    expectedImpact: 'positive',
    tags: ['interest-rates', 'monetary-policy', 'fed']
  },
  {
    id: '2024-healthcare-proposal',
    date: '2024-02-10',
    title: 'Medicare for All Proposal Introduced',
    description: 'Progressive Democrats introduce comprehensive healthcare reform',
    type: 'legislation',
    alignment: 'left',
    severity: 'critical',
    affectedSectors: ['healthcare'],
    expectedImpact: 'negative',
    tags: ['healthcare', 'medicare', 'reform']
  },
  {
    id: '2024-defense-budget',
    date: '2024-04-05',
    title: 'Defense Budget Increase Approved',
    description: 'Congress approves 8% increase in defense spending',
    type: 'legislation',
    alignment: 'right',
    severity: 'medium',
    affectedSectors: ['defense'],
    expectedImpact: 'positive',
    tags: ['defense', 'military', 'spending']
  },
  {
    id: '2024-tech-antitrust',
    date: '2024-05-15',
    title: 'Major Tech Antitrust Investigation',
    description: 'DOJ launches investigation into Big Tech monopolies',
    type: 'policy',
    alignment: 'left',
    severity: 'high',
    affectedSectors: ['tech'],
    expectedImpact: 'negative',
    tags: ['antitrust', 'regulation', 'big-tech']
  }
];

// Event classification functions
export const classifyEventAlignment = (event: PoliticalEvent): PoliticalAlignment => {
  const leftIndicators = ['regulation', 'tax-increase', 'social-spending', 'climate-action', 'healthcare-expansion'];
  const rightIndicators = ['deregulation', 'tax-cut', 'defense-spending', 'business-friendly', 'oil-drilling'];
  
  const leftScore = leftIndicators.filter(indicator => 
    event.tags.some(tag => tag.includes(indicator))
  ).length;
  
  const rightScore = rightIndicators.filter(indicator => 
    event.tags.some(tag => tag.includes(indicator))
  ).length;
  
  if (leftScore > rightScore) return 'left';
  if (rightScore > leftScore) return 'right';
  return event.alignment || 'neutral';
};

// Market impact prediction based on political alignment
export const predictMarketImpact = (
  event: PoliticalEvent,
  sector: MarketSector
): { direction: 'positive' | 'negative' | 'neutral', confidence: number } => {
  
  // Left-wing policies typically impact
  const leftImpacts: Record<string, string> = {
    healthcare: 'negative', // More regulation
    energy: 'negative',     // Environmental restrictions on oil/gas
    defense: 'negative',    // Reduced military spending
    financial: 'negative',  // More regulation
    tech: 'negative',       // Antitrust actions
    infrastructure: 'positive' // Public spending
  };
  
  // Right-wing policies typically impact  
  const rightImpacts: Record<string, string> = {
    healthcare: 'positive',    // Less regulation
    energy: 'positive',       // Pro oil/gas policies
    defense: 'positive',      // Increased military spending
    financial: 'positive',    // Deregulation
    tech: 'positive',         // Less antitrust
    infrastructure: 'neutral' // Mixed public-private approach
  };
  
  let prediction: 'positive' | 'negative' | 'neutral' = 'neutral';
  let confidence = 0.5;
  
  if (event.alignment === 'left' && leftImpacts[sector]) {
    prediction = leftImpacts[sector] as 'positive' | 'negative' | 'neutral';
    confidence = 0.7;
  } else if (event.alignment === 'right' && rightImpacts[sector]) {
    prediction = rightImpacts[sector] as 'positive' | 'negative' | 'neutral';
    confidence = 0.7;
  }
  
  // Adjust confidence based on event severity
  if (event.severity === 'critical') confidence = Math.min(confidence + 0.2, 0.9);
  if (event.severity === 'low') confidence = Math.max(confidence - 0.2, 0.3);
  
  return { direction: prediction, confidence };
};

// Get upcoming political events (placeholder - in production would come from news APIs)
export const getUpcomingPoliticalEvents = (): PoliticalEvent[] => {
  const futureEvents: PoliticalEvent[] = [
    {
      id: 'upcoming-election-2024',
      date: '2024-11-05',
      title: '2024 Presidential Election',
      description: 'US Presidential and Congressional elections',
      type: 'election',
      alignment: 'neutral',
      severity: 'critical',
      affectedSectors: ['all'],
      expectedImpact: 'neutral',
      tags: ['election', 'presidential', 'congress']
    },
    {
      id: 'upcoming-fed-meeting',
      date: '2024-09-18',
      title: 'Federal Reserve FOMC Meeting',
      description: 'Next scheduled Federal Open Market Committee meeting',
      type: 'economic',
      alignment: 'neutral',
      severity: 'high',
      affectedSectors: ['financial', 'all'],
      expectedImpact: 'neutral',
      tags: ['fed', 'interest-rates', 'monetary-policy']
    }
  ];
  
  return futureEvents;
};

// Calculate political risk score for different sectors
export const calculatePoliticalRiskScore = (
  sector: MarketSector,
  upcomingEvents: PoliticalEvent[]
): { score: number, factors: string[] } => {
  let riskScore = 0;
  const factors: string[] = [];
  
  upcomingEvents.forEach(event => {
    if (event.affectedSectors.includes(sector) || event.affectedSectors.includes('all')) {
      const impact = predictMarketImpact(event, sector);
      const eventRisk = event.severity === 'critical' ? 0.8 : 
                       event.severity === 'high' ? 0.6 : 
                       event.severity === 'medium' ? 0.4 : 0.2;
      
      riskScore += eventRisk * impact.confidence;
      factors.push(`${event.title} (${event.alignment})`);
    }
  });
  
  return {
    score: Math.min(riskScore, 1), // Cap at 1.0
    factors: factors.slice(0, 3) // Top 3 risk factors
  };
};

// Development logging for political events
export const logPoliticalEventAnalysis = (
  event: PoliticalEvent,
  marketImpact: Record<string, unknown>
) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    eventId: event.id,
    alignment: event.alignment,
    severity: event.severity,
    predictedImpact: marketImpact,
    type: 'political-event-analysis'
  };
  
  console.log('🏛️ Political Event Analysis:', logEntry);
  
  // Store for blog post development log
  if (typeof window !== 'undefined') {
    const logs = JSON.parse(localStorage.getItem('dev-logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('dev-logs', JSON.stringify(logs.slice(-100)));
  }
};