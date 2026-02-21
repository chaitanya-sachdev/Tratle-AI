// Mock data and service layer for Tradle AI

export interface HSCodeResult {
  code: string;
  description: string;
  confidence: number;
  dutyRate: number;
}

export interface FTAEligibility {
  agreement: string;
  eligible: boolean;
  rvcPercentage: number;
  requiredRvc: number;
  savings: number;
}

export interface CostBreakdown {
  productValue: number;
  dutyAmount: number;
  shippingCost: number;
  insurance: number;
  handlingFees: number;
  totalLandedCost: number;
}

export interface ShippingOption {
  mode: "air" | "sea" | "land";
  cost: number;
  transitDays: number;
  co2Kg: number;
}

export interface OptimizedRoute {
  currentPath: { countries: string[]; totalDuty: number; totalCost: number };
  suggestedPath: { countries: string[]; totalDuty: number; totalCost: number };
  savings: number;
  savingsPercent: number;
  reason: string;
}

export interface AnalysisResult {
  hsCode: HSCodeResult;
  alternativeCodes: HSCodeResult[];
  ftaEligibility: FTAEligibility[];
  costBreakdown: CostBreakdown;
  shippingOptions: ShippingOption[];
  optimizedRoute: OptimizedRoute;
  complianceRisk: "low" | "medium" | "high";
  recommendation: string;
  reasoning: string;
}

export const mockAnalysis: AnalysisResult = {
  hsCode: {
    code: "8471.30.01",
    description: "Portable automatic data processing machines, weighing not more than 10 kg",
    confidence: 94.2,
    dutyRate: 0,
  },
  alternativeCodes: [
    { code: "8471.41.01", description: "Other data processing machines, comprising a CPU and I/O unit", confidence: 78.5, dutyRate: 2.5 },
    { code: "8473.30.01", description: "Parts and accessories of data processing machines", confidence: 45.1, dutyRate: 3.2 },
    { code: "8471.49.00", description: "Other digital processing units", confidence: 32.8, dutyRate: 1.8 },
  ],
  ftaEligibility: [
    { agreement: "USMCA", eligible: true, rvcPercentage: 72, requiredRvc: 62.5, savings: 4250 },
    { agreement: "KORUS", eligible: false, rvcPercentage: 38, requiredRvc: 55, savings: 0 },
    { agreement: "EU-Japan EPA", eligible: true, rvcPercentage: 68, requiredRvc: 50, savings: 3800 },
  ],
  costBreakdown: {
    productValue: 125000,
    dutyAmount: 3125,
    shippingCost: 4800,
    insurance: 625,
    handlingFees: 1200,
    totalLandedCost: 134750,
  },
  shippingOptions: [
    { mode: "air", cost: 8200, transitDays: 3, co2Kg: 4120 },
    { mode: "sea", cost: 2400, transitDays: 28, co2Kg: 890 },
    { mode: "land", cost: 4800, transitDays: 12, co2Kg: 2100 },
  ],
  optimizedRoute: {
    currentPath: {
      countries: ["China", "United States"],
      totalDuty: 31250,
      totalCost: 134750,
    },
    suggestedPath: {
      countries: ["China", "Vietnam", "United States"],
      totalDuty: 18750,
      totalCost: 123200,
    },
    savings: 11550,
    savingsPercent: 8.6,
    reason: "Routing through Vietnam leverages the US-Vietnam bilateral trade agreement, reducing the effective duty rate from 25% to 15%. While there is an additional $800 transshipment cost, the $12,500 duty reduction results in a net saving of $11,550. Vietnam qualifies as a substantial transformation hub under CPTPP rules of origin.",
  },
  complianceRisk: "low",
  recommendation: "Classify under HS 8471.30.01 and leverage USMCA preferential tariff for $4,250 in duty savings. Ship via sea freight for optimal cost-transit balance.",
  reasoning: "Based on product specifications (portable computing device <10kg), GRI Rule 1 directly maps to heading 8471. Subheading 8471.30 applies as the device meets the portability criteria. USMCA origin qualification is met with 72% RVC exceeding the 62.5% threshold. The product's bill of materials shows sufficient North American content from qualifying suppliers.",
};

export interface TradeRoute {
  id: string;
  countries: string[];
  label: string;
  dutyMultiplier: number;
  transshipCost: number;
}

export const tradeRoutes: TradeRoute[] = [
  { id: "direct", countries: ["China", "United States"], label: "Direct", dutyMultiplier: 1.0, transshipCost: 0 },
  { id: "vietnam", countries: ["China", "Vietnam", "United States"], label: "Via Vietnam", dutyMultiplier: 0.6, transshipCost: 800 },
  { id: "malaysia", countries: ["China", "Malaysia", "United States"], label: "Via Malaysia", dutyMultiplier: 0.7, transshipCost: 650 },
  { id: "mexico", countries: ["China", "Mexico", "United States"], label: "Via Mexico", dutyMultiplier: 0.45, transshipCost: 1200 },
  { id: "india", countries: ["China", "India", "United States"], label: "Via India", dutyMultiplier: 0.55, transshipCost: 900 },
];

export interface ScenarioConfig {
  hsCode: string;
  ftaEnabled: boolean;
  shippingMode: "air" | "sea" | "land";
  routeId: string;
}

export interface ScenarioResult extends CostBreakdown {
  routeCountries: string[];
  routeLabel: string;
}

export function calculateScenario(config: ScenarioConfig): ScenarioResult {
  const base = 125000;
  const dutyRates: Record<string, number> = {
    "8471.30.01": 0, "8471.41.01": 0.025, "8473.30.01": 0.032, "8471.49.00": 0.018,
  };
  const shippingCosts: Record<string, number> = { air: 8200, sea: 2400, land: 4800 };
  const route = tradeRoutes.find((r) => r.id === config.routeId) ?? tradeRoutes[0];
  const rate = dutyRates[config.hsCode] ?? 0.025;
  const effectiveRate = config.ftaEnabled ? Math.max(0, rate - 0.02) : rate;
  const duty = base * effectiveRate * route.dutyMultiplier;
  const shipping = shippingCosts[config.shippingMode] + route.transshipCost;
  return {
    productValue: base,
    dutyAmount: Math.round(duty),
    shippingCost: shipping,
    insurance: 625,
    handlingFees: 1200,
    totalLandedCost: Math.round(base + duty + shipping + 625 + 1200),
    routeCountries: route.countries,
    routeLabel: route.label,
  };
}

export function findCheapestRoute(config: Omit<ScenarioConfig, "routeId">): { best: ScenarioResult; bestRouteId: string } {
  let best: ScenarioResult | null = null;
  let bestRouteId = "direct";
  for (const route of tradeRoutes) {
    const result = calculateScenario({ ...config, routeId: route.id });
    if (!best || result.totalLandedCost < best.totalLandedCost) {
      best = result;
      bestRouteId = route.id;
    }
  }
  return { best: best!, bestRouteId };
}

export const mockReportSections = [
  {
    title: "Classification Analysis",
    content: "The submitted product has been classified under HS Code 8471.30.01 with 94.2% confidence. This classification is based on GRI Rule 1 interpretation, matching the product's characteristics as a portable automatic data processing machine weighing under 10 kg.",
    bullets: [
      "Primary classification: 8471.30.01 (94.2% confidence)",
      "3 alternative codes evaluated and ranked",
      "Classification aligns with WCO guidelines and recent rulings",
    ],
  },
  {
    title: "Trade Agreement Eligibility",
    content: "The product qualifies for preferential treatment under USMCA with a Regional Value Content of 72%, exceeding the required 62.5% threshold. This results in potential duty savings of $4,250 per shipment.",
    bullets: [
      "USMCA eligible — 72% RVC (threshold: 62.5%)",
      "EU-Japan EPA eligible — 68% RVC (threshold: 50%)",
      "KORUS not eligible — 38% RVC (threshold: 55%)",
    ],
  },
  {
    title: "Landed Cost Summary",
    content: "Total landed cost calculated at $134,750 using optimal routing. Sea freight recommended for standard shipments, providing the best balance of cost ($2,400) and acceptable transit time (28 days).",
    bullets: [
      "Product value: $125,000",
      "Duties & taxes: $3,125",
      "Logistics & handling: $6,625",
      "Total landed cost: $134,750",
    ],
  },
  {
    title: "Optimization Recommendations",
    content: "Three key optimizations identified that could reduce total landed cost by up to 8.3% through strategic HS classification, FTA utilization, and shipping mode selection.",
    bullets: [
      "Leverage USMCA for $4,250 duty savings",
      "Use sea freight to save $5,800 vs air",
      "Consolidate shipments for volume discounts",
      "Review BOM for additional origin qualification opportunities",
    ],
  },
];
