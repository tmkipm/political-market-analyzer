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

// Historical political events for training our model (2020-2024)
export const HISTORICAL_POLITICAL_EVENTS: PoliticalEvent[] = [
  // 2020 Major Events
  {
    id: '2020-election',
    date: '2020-11-07',
    title: '2020 Presidential Election Results',
    description: 'Biden wins presidency, Democrats gain unified control',
    type: 'election',
    alignment: 'left',
    severity: 'critical',
    affectedSectors: ['healthcare', 'energy', 'financial', 'all'],
    expectedImpact: 'positive',
    actualImpact: 0.05, // S&P 500 gained ~5% in following weeks
    tags: ['election', 'biden', 'democratic-control']
  },
  {
    id: '2020-covid-stimulus',
    date: '2020-12-27',
    title: '$900B COVID Relief Package',
    description: 'Congress passes second major COVID-19 stimulus package',
    type: 'policy',
    alignment: 'neutral',
    severity: 'critical',
    affectedSectors: ['all', 'financial'],
    expectedImpact: 'positive',
    actualImpact: 0.08,
    tags: ['stimulus', 'covid', 'spending']
  },

  // 2021 Major Events  
  {
    id: '2021-infrastructure-bill',
    date: '2021-11-15',
    title: '$1.2T Infrastructure Investment Act',
    description: 'Bipartisan infrastructure bill signed into law',
    type: 'legislation',
    alignment: 'left',
    severity: 'high',
    affectedSectors: ['infrastructure', 'energy'],
    expectedImpact: 'positive',
    actualImpact: 0.12,
    tags: ['infrastructure', 'spending', 'bipartisan']
  },
  {
    id: '2021-fed-taper',
    date: '2021-11-03',
    title: 'Fed Announces Tapering',
    description: 'Federal Reserve begins reducing bond purchases',
    type: 'economic',
    alignment: 'neutral',
    severity: 'high',
    affectedSectors: ['financial', 'all'],
    expectedImpact: 'negative',
    actualImpact: -0.03,
    tags: ['fed', 'taper', 'monetary-policy']
  },

  // 2022 Major Events
  {
    id: '2022-midterm-elections',
    date: '2022-11-08',
    title: '2022 Midterm Elections',
    description: 'Republicans take House, Democrats keep Senate',
    type: 'election',
    alignment: 'neutral',
    severity: 'high',
    affectedSectors: ['all'],
    expectedImpact: 'positive',
    actualImpact: 0.04,
    tags: ['midterms', 'divided-government', 'gridlock']
  },
  {
    id: '2022-inflation-reduction-act',
    date: '2022-08-16',
    title: 'Inflation Reduction Act',
    description: '$370B climate and healthcare spending bill',
    type: 'legislation',
    alignment: 'left',
    severity: 'high',
    affectedSectors: ['healthcare', 'energy'],
    expectedImpact: 'positive',
    actualImpact: 0.06,
    tags: ['climate', 'healthcare', 'inflation']
  },

  // 2023 Major Events
  {
    id: '2023-debt-ceiling',
    date: '2023-06-03',
    title: 'Debt Ceiling Deal',
    description: 'Biden and McCarthy reach debt ceiling agreement',
    type: 'policy',
    alignment: 'neutral',
    severity: 'critical',
    affectedSectors: ['financial', 'all'],
    expectedImpact: 'positive',
    actualImpact: 0.07,
    tags: ['debt-ceiling', 'fiscal-policy', 'compromise']
  },
  {
    id: '2023-bank-crisis',
    date: '2023-03-12',
    title: 'Silicon Valley Bank Collapse',
    description: 'Regional banking crisis sparks regulatory response',
    type: 'economic',
    alignment: 'neutral',
    severity: 'high',
    affectedSectors: ['financial', 'tech'],
    expectedImpact: 'negative',
    actualImpact: -0.08,
    tags: ['banking', 'regulation', 'crisis']
  },

  // 2024 Events
  {
    id: '2024-ai-regulation',
    date: '2024-01-25',
    title: 'AI Safety Executive Order',
    description: 'Biden administration announces comprehensive AI regulation framework',
    type: 'policy',
    alignment: 'left',
    severity: 'high',
    affectedSectors: ['tech'],
    expectedImpact: 'negative',
    actualImpact: -0.04,
    tags: ['ai', 'regulation', 'tech-policy']
  },
  {
    id: '2024-green-energy-credits',
    date: '2024-03-15',
    title: 'Extended Clean Energy Tax Credits',
    description: 'Congress extends renewable energy tax incentives through 2030',
    type: 'legislation',
    alignment: 'left',
    severity: 'medium',
    affectedSectors: ['energy', 'infrastructure'],
    expectedImpact: 'positive',
    actualImpact: 0.09,
    tags: ['renewable-energy', 'tax-credits', 'climate']
  },
  {
    id: '2024-defense-spending',
    date: '2024-04-20',
    title: 'Record Defense Authorization',
    description: '$886B defense budget approved with bipartisan support',
    type: 'legislation',
    alignment: 'right',
    severity: 'medium',
    affectedSectors: ['defense'],
    expectedImpact: 'positive',
    actualImpact: 0.05,
    tags: ['defense', 'military-spending', 'bipartisan']
  },
  {
    id: '2024-healthcare-reform',
    date: '2024-06-10',
    title: 'Medicare Drug Price Negotiations',
    description: 'First round of Medicare drug price negotiations announced',
    type: 'policy',
    alignment: 'left',
    severity: 'high',
    affectedSectors: ['healthcare'],
    expectedImpact: 'negative',
    actualImpact: -0.06,
    tags: ['medicare', 'drug-pricing', 'healthcare-reform']
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