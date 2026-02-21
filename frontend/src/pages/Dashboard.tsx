import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, Lightbulb, ArrowRight, TrendingDown, Route, MapPin, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import GlassCard from "@/components/GlassCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import ConfidenceRing from "@/components/ConfidenceRing";
import { mockAnalysis } from "@/services/mockData";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { TradeResponse } from "@/services/api";

const mockData = mockAnalysis;

const Dashboard = () => {
  const [data, setData] = useState(mockData);
  const [ftaOn, setFtaOn] = useState(true);

  useEffect(() => {
    // Try to get real data from sessionStorage
    const storedAnalysis = sessionStorage.getItem('tradeAnalysis');
    console.log('Stored analysis from sessionStorage:', storedAnalysis);
    
    if (storedAnalysis) {
      try {
        const analysis: TradeResponse = JSON.parse(storedAnalysis);
        console.log('Parsed analysis:', analysis);
        
        // Ensure we have valid data structure
        if (!analysis || !analysis.hs_analysis) {
          console.error('Invalid analysis structure:', analysis);
          return;
        }
        
        // Transform the API response to match the expected data structure
        const transformedData = {
          hsCode: {
            code: analysis.hs_analysis.predicted_code || 'Unknown',
            description: "AI Classified Product",
            confidence: (analysis.hs_analysis.confidence || 0) * 100,
            dutyRate: 0.025 // Placeholder
          },
          alternativeCodes: (analysis.hs_analysis.alternatives || []).map(code => ({
            code: code || 'Unknown',
            description: "Alternative classification",
            confidence: 75,
            dutyRate: 0.02
          })),
          ftaEligibility: [{
            agreement: analysis.origin_result?.applied_fta || "Not Applicable",
            eligible: analysis.origin_result?.is_eligible || false,
            rvcPercentage: analysis.origin_result?.rvc_score || 0,
            requiredRvc: 62.5,
            savings: (analysis.origin_result?.is_eligible && analysis.origin_result?.rvc_score > 62.5) ? 4250 : 0
          }],
          costBreakdown: {
            productValue: analysis.duty_breakdown?.customs_value || 0,
            dutyAmount: analysis.duty_breakdown?.base_duty_amount || 0,
            shippingCost: analysis.duty_breakdown?.shipping_cost || 0,
            insurance: analysis.duty_breakdown?.vat_amount || 0,
            handlingFees: 1200,
            totalLandedCost: analysis.duty_breakdown?.total_landed_cost || 0
          },
          shippingOptions: [
            { mode: "air" as const, cost: 8200, transitDays: 3, co2Kg: 4120 },
            { mode: "sea" as const, cost: 2400, transitDays: 28, co2Kg: 890 },
            { mode: "land" as const, cost: 4800, transitDays: 12, co2Kg: 2100 },
          ],
          optimizedRoute: {
            currentPath: {
              countries: analysis.duty_breakdown ? ["Direct Route"] : [],
              totalDuty: analysis.duty_breakdown?.base_duty_amount || 0,
              totalCost: analysis.duty_breakdown?.total_landed_cost || 0
            },
            suggestedPath: {
              countries: analysis.optimization ? ["Optimized Route"] : [],
              totalDuty: Math.max(0, (analysis.duty_breakdown?.base_duty_amount || 0) - (analysis.optimization?.estimated_savings || 0)),
              totalCost: Math.max(0, (analysis.duty_breakdown?.total_landed_cost || 0) - (analysis.optimization?.estimated_savings || 0))
            },
            savings: analysis.optimization?.estimated_savings || 0,
            savingsPercent: analysis.optimization ? ((analysis.optimization.estimated_savings || 0) / (analysis.duty_breakdown?.total_landed_cost || 1)) * 100 : 0,
            reason: analysis.optimization?.actionable_advice || "No optimization available"
          },
          complianceRisk: (analysis.hs_analysis.confidence || 0) > 0.8 ? "low" as const : "medium" as const,
          recommendation: "Based on AI analysis",
          reasoning: analysis.hs_analysis.reasoning || "Analysis complete"
        };
        
        console.log('Transformed data:', transformedData);
        setData(transformedData);
      } catch (error) {
        console.error('Failed to parse stored analysis:', error);
        // Keep using mock data
      }
    }
  }, []);

  const savings = ftaOn && data.ftaEligibility[0]?.eligible ? data.ftaEligibility[0].savings : 0;

  const costPieData = [
    { name: "Product", value: data.costBreakdown?.productValue || 0, color: "hsl(265 90% 60%)" },
    { name: "Duty", value: data.costBreakdown?.dutyAmount || 0, color: "hsl(0 72% 55%)" },
    { name: "Shipping", value: data.costBreakdown?.shippingCost || 0, color: "hsl(175 80% 45%)" },
    { name: "Insurance", value: data.costBreakdown?.insurance || 0, color: "hsl(38 92% 55%)" },
    { name: "Handling", value: data.costBreakdown?.handlingFees || 0, color: "hsl(220 15% 55%)" },
  ];

  const shippingBarData = data.shippingOptions?.map((o) => ({
    name: o.mode.charAt(0).toUpperCase() + o.mode.slice(1),
    cost: o.cost || 0,
    days: o.transitDays || 0,
  }));

  const fadeUp = (i: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const } },
  });

  const riskColors = { low: "text-success", medium: "text-warning", high: "text-destructive" };
  const riskBg = { low: "bg-success/10", medium: "bg-warning/10", high: "bg-destructive/10" };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Analysis Dashboard</h1>
          <p className="text-sm text-muted-foreground">HS 8471.30.01 · Mexico → United States · 500 units</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/simulator"><Button variant="outline" size="sm">Simulator</Button></Link>
          <Link to="/report"><Button variant="default" size="sm">View Report <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-5">
        {/* HS Code + Confidence */}
        <motion.div className="lg:col-span-4" {...fadeUp(0)}>
          <GlassCard className="h-full" hover>
            <p className="text-xs text-muted-foreground font-medium mb-4">HS Classification</p>
            <div className="flex items-start gap-4">
              <ConfidenceRing value={data.hsCode.confidence} size={100} />
              <div className="flex-1">
                <p className="text-xl font-bold font-mono text-foreground">{data.hsCode.code}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{data.hsCode.description}</p>
                <p className="text-xs text-primary mt-2 font-medium">Duty Rate: {data.hsCode.dutyRate}%</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Alternatives</p>
              {data.alternativeCodes.map((c) => (
                <div key={c.code} className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-muted/30">
                  <span className="font-mono text-foreground">{c.code}</span>
                  <span className="text-muted-foreground">{c.confidence}%</span>
                  <span className="text-muted-foreground">{c.dutyRate}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Landed Cost */}
        <motion.div className="lg:col-span-4" {...fadeUp(1)}>
          <GlassCard className="h-full" hover>
            <p className="text-xs text-muted-foreground font-medium mb-4">Landed Cost Breakdown</p>
            <div className="text-center mb-4">
              <p className="text-xs text-muted-foreground">Total Landed Cost</p>
              <div className="text-3xl font-bold text-foreground mt-1">
                <AnimatedCounter value={data.costBreakdown.totalLandedCost} prefix="$" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={costPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                  {costPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(228 35% 11%)", border: "1px solid hsl(228 25% 18%)", borderRadius: 8, fontSize: 12 }}
                  itemStyle={{ color: "hsl(220 20% 92%)" }}
                  formatter={(v: number) => `$${v.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 text-xs mt-2">
              {costPieData.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-muted-foreground">{c.name}</span>
                  <span className="ml-auto font-medium text-foreground">${c.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* FTA + Compliance */}
        <motion.div className="lg:col-span-4 space-y-5" {...fadeUp(2)}>
          {/* FTA Toggle */}
          <GlassCard hover>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">FTA Savings</p>
              <button
                onClick={() => setFtaOn(!ftaOn)}
                className={cn(
                  "w-10 h-5 rounded-full transition-colors duration-300 relative",
                  ftaOn ? "bg-primary" : "bg-muted"
                )}
              >
                <motion.span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-foreground"
                  animate={{ left: ftaOn ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
            <div className="text-2xl font-bold text-foreground flex items-center gap-2">
              <TrendingDown className={cn("w-5 h-5", ftaOn ? "text-success" : "text-muted-foreground")} />
              <AnimatedCounter value={savings} prefix="$" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{ftaOn ? "USMCA preferential rate applied" : "MFN rate — no FTA applied"}</p>
          </GlassCard>

          {/* FTA Eligibility */}
          <GlassCard hover>
            <p className="text-xs text-muted-foreground font-medium mb-3">FTA Eligibility</p>
            {data.ftaEligibility.map((f) => (
              <div key={f.agreement} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-foreground">{f.agreement}</span>
                  <span className={f.eligible ? "text-success" : "text-destructive"}>
                    {f.eligible ? "Eligible" : "Not Eligible"}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full", f.eligible ? "bg-success" : "bg-destructive/50")}
                    initial={{ width: 0 }}
                    animate={{ width: `${f.rvcPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                  <span>RVC: {f.rvcPercentage}%</span>
                  <span>Required: {f.requiredRvc}%</span>
                </div>
              </div>
            ))}
          </GlassCard>

          {/* Compliance Risk */}
          <GlassCard hover>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Compliance Risk</p>
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full capitalize", riskColors[data.complianceRisk], riskBg[data.complianceRisk])}>
                {data.complianceRisk}
              </span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Shipping */}
        <motion.div className="lg:col-span-6" {...fadeUp(3)}>
          <GlassCard hover>
            <p className="text-xs text-muted-foreground font-medium mb-4">Shipping Cost Comparison</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={shippingBarData} barSize={32}>
                <XAxis dataKey="name" tick={{ fill: "hsl(220 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(220 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(228 35% 11%)", border: "1px solid hsl(228 25% 18%)", borderRadius: 8, fontSize: 12 }}
                  itemStyle={{ color: "hsl(220 20% 92%)" }}
                  formatter={(v: number) => `$${v.toLocaleString()}`}
                />
                <Bar dataKey="cost" fill="hsl(265 90% 60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {data.shippingOptions.map((o) => (
                <div key={o.mode} className="text-center">
                  <p className="text-xs text-muted-foreground">{o.transitDays} days</p>
                  <p className="text-xs text-muted-foreground">{o.co2Kg} kg CO₂</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recommendation */}
        <motion.div className="lg:col-span-6" {...fadeUp(4)}>
          <GlassCard hover className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-warning" />
              <p className="text-xs font-semibold text-foreground">AI Recommendation</p>
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-4">{data.recommendation}</p>
            <div className="glass-card p-4 mt-auto">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-semibold text-foreground">Explainability</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{data.reasoning}</p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Optimized Trade Route */}
        <motion.div className="lg:col-span-12" {...fadeUp(5)}>
          <GlassCard hover className="gradient-border">
            <div className="flex items-center gap-2 mb-5">
              <Route className="w-4 h-4 text-accent" />
              <p className="text-xs font-semibold text-foreground">Optimized Trade Route</p>
              <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
                Save {data.optimizedRoute.savingsPercent}%
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {/* Current Path */}
              <div className="glass-card p-4">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">Current Path</p>
                <div className="flex items-center gap-1.5 flex-wrap mb-3">
                  {data.optimizedRoute.currentPath.countries.map((country, i) => (
                    <span key={country} className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 text-xs font-medium text-foreground bg-muted/40 px-2 py-1 rounded-md">
                        <MapPin className="w-3 h-3 text-destructive" />
                        {country}
                      </span>
                      {i < data.optimizedRoute.currentPath.countries.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      )}
                    </span>
                  ))}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Duties</span><span className="font-medium text-destructive">${(data.optimizedRoute?.currentPath?.totalDuty || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Cost</span><span className="font-bold text-foreground">${(data.optimizedRoute?.currentPath?.totalCost || 0).toLocaleString()}</span></div>
                </div>
              </div>

              {/* Savings Center */}
              <div className="flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  className="w-14 h-14 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mb-2"
                >
                  <TrendingDown className="w-6 h-6 text-success" />
                </motion.div>
                <p className="text-2xl font-bold text-success">
                  <AnimatedCounter value={data.optimizedRoute.savings} prefix="-$" />
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">via alternate routing</p>
              </div>

              {/* Suggested Path */}
              <div className="glass-card p-4">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">Suggested Path</p>
                <div className="flex items-center gap-1.5 flex-wrap mb-3">
                  {data.optimizedRoute.suggestedPath.countries.map((country, i) => (
                    <span key={country} className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 text-xs font-medium text-foreground bg-success/10 px-2 py-1 rounded-md">
                        <MapPin className="w-3 h-3 text-success" />
                        {country}
                      </span>
                      {i < data.optimizedRoute.suggestedPath.countries.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      )}
                    </span>
                  ))}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Duties</span><span className="font-medium text-success">${(data.optimizedRoute?.suggestedPath?.totalDuty || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Cost</span><span className="font-bold text-foreground">${(data.optimizedRoute?.suggestedPath?.totalCost || 0).toLocaleString()}</span></div>
                </div>
              </div>
            </div>

            <div className="mt-4 glass-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs text-muted-foreground font-medium">Why This Route?</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{data.optimizedRoute.reason}</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
