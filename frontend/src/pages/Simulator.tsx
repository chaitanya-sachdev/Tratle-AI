import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, MapPin, ChevronRight, TrendingDown, Lightbulb, Route } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import { calculateScenario, findCheapestRoute, tradeRoutes, type ScenarioConfig } from "@/services/mockData";
import { cn } from "@/lib/utils";

const hsCodes = [
  { code: "8471.30.01", label: "Portable ADP (0%)" },
  { code: "8471.41.01", label: "Other ADP (2.5%)" },
  { code: "8473.30.01", label: "Parts ADP (3.2%)" },
  { code: "8471.49.00", label: "Digital units (1.8%)" },
];

const modes: Array<{ id: "air" | "sea" | "land"; label: string }> = [
  { id: "air", label: "Air" },
  { id: "sea", label: "Sea" },
  { id: "land", label: "Land" },
];

export default function Simulator() {
  const [configA, setConfigA] = useState<ScenarioConfig>({ hsCode: "8471.30.01", ftaEnabled: true, shippingMode: "sea", routeId: "direct" });
  const [configB, setConfigB] = useState<ScenarioConfig>({ hsCode: "8471.41.01", ftaEnabled: false, shippingMode: "air", routeId: "vietnam" });

  const resultA = calculateScenario(configA);
  const resultB = calculateScenario(configB);
  const diff = resultA.totalLandedCost - resultB.totalLandedCost;

  const cheapestA = findCheapestRoute({ hsCode: configA.hsCode, ftaEnabled: configA.ftaEnabled, shippingMode: configA.shippingMode });
  const cheapestB = findCheapestRoute({ hsCode: configB.hsCode, ftaEnabled: configB.ftaEnabled, shippingMode: configB.shippingMode });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-primary" /> Scenario Simulator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Compare trade configurations and routes side-by-side</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {[
          { config: configA, setConfig: setConfigA, result: resultA, label: "Scenario A", cheapest: cheapestA },
          { config: configB, setConfig: setConfigB, result: resultB, label: "Scenario B", cheapest: cheapestB },
        ].map(({ config, setConfig, result, label, cheapest }) => {
          const hasCheaperRoute = cheapest.bestRouteId !== config.routeId;
          const routeSavings = result.totalLandedCost - cheapest.best.totalLandedCost;

          return (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <GlassCard hover>
                <h2 className="text-sm font-semibold mb-5">{label}</h2>

                {/* HS Code selector */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">HS Code</p>
                  <div className="grid grid-cols-2 gap-2">
                    {hsCodes.map((hs) => (
                      <button
                        key={hs.code}
                        onClick={() => setConfig({ ...config, hsCode: hs.code })}
                        className={cn(
                          "text-xs p-2 rounded-lg border transition-all duration-200 text-left",
                          config.hsCode === hs.code
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        <span className="font-mono font-medium">{hs.code}</span>
                        <br /><span className="text-[10px]">{hs.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trade Route selector */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Trade Route</p>
                  <div className="space-y-1.5">
                    {tradeRoutes.map((route) => (
                      <button
                        key={route.id}
                        onClick={() => setConfig({ ...config, routeId: route.id })}
                        className={cn(
                          "w-full flex items-center gap-1.5 text-xs p-2 rounded-lg border transition-all duration-200",
                          config.routeId === route.id
                            ? "border-accent/50 bg-accent/10"
                            : "border-border bg-muted/30 hover:bg-muted/50"
                        )}
                      >
                        {route.countries.map((c, i) => (
                          <span key={c} className="flex items-center gap-1">
                            <span className={cn(
                              "font-medium",
                              config.routeId === route.id ? "text-accent" : "text-muted-foreground"
                            )}>{c}</span>
                            {i < route.countries.length - 1 && (
                              <ChevronRight className="w-3 h-3 text-muted-foreground" />
                            )}
                          </span>
                        ))}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FTA Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-muted-foreground font-medium">FTA (USMCA)</p>
                  <button
                    onClick={() => setConfig({ ...config, ftaEnabled: !config.ftaEnabled })}
                    className={cn("w-10 h-5 rounded-full transition-colors duration-300 relative", config.ftaEnabled ? "bg-primary" : "bg-muted")}
                  >
                    <motion.span
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-foreground"
                      animate={{ left: config.ftaEnabled ? 22 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Shipping Mode */}
                <div className="mb-5">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Shipping Mode</p>
                  <div className="grid grid-cols-3 gap-2">
                    {modes.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setConfig({ ...config, shippingMode: m.id })}
                        className={cn(
                          "text-xs py-2 rounded-lg border transition-all duration-200 font-medium",
                          config.shippingMode === m.id
                            ? "border-accent/50 bg-accent/10 text-accent"
                            : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="border-t border-border pt-4 space-y-2">
                  {[
                    ["Product Value", result.productValue],
                    ["Duty", result.dutyAmount],
                    ["Shipping", result.shippingCost],
                    ["Insurance", result.insurance],
                    ["Handling", result.handlingFees],
                  ].map(([lbl, val]) => (
                    <div key={lbl as string} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{lbl}</span>
                      <span className="font-medium text-foreground">${(val as number).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                    <span>Total Landed Cost</span>
                    <AnimatedCounter value={result.totalLandedCost} prefix="$" className="text-foreground" />
                  </div>
                </div>

                {/* Optimized route suggestion */}
                {hasCheaperRoute && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 rounded-lg border border-success/20 bg-success/5 p-3"
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <Lightbulb className="w-3.5 h-3.5 text-success" />
                      <span className="text-[10px] uppercase tracking-wider text-success font-semibold">Cheaper Route Available</span>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap mb-2">
                      {cheapest.best.routeCountries.map((c, i) => (
                        <span key={c} className="flex items-center gap-1">
                          <span className="flex items-center gap-0.5 text-xs font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">
                            <MapPin className="w-2.5 h-2.5" />
                            {c}
                          </span>
                          {i < cheapest.best.routeCountries.length - 1 && (
                            <ChevronRight className="w-3 h-3 text-muted-foreground" />
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">You'd save</span>
                      <span className="font-bold text-success">${routeSavings.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => setConfig({ ...config, routeId: cheapest.bestRouteId })}
                      className="mt-2 w-full text-[11px] font-medium py-1.5 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors"
                    >
                      Switch to this route
                    </button>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison */}
      <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <GlassCard className="text-center gradient-border">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Cost Difference</p>
          <div className={cn("text-4xl font-bold", diff < 0 ? "text-success" : diff > 0 ? "text-destructive" : "text-foreground")}>
            <AnimatedCounter value={Math.abs(diff)} prefix={diff <= 0 ? "-$" : "+$"} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {diff < 0 ? "Scenario A saves money vs B" : diff > 0 ? "Scenario B saves money vs A" : "Both scenarios equal"}
          </p>

          {/* Route comparison */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
            {[resultA, resultB].map((r, idx) => (
              <div key={idx}>
                <p className="text-[10px] text-muted-foreground mb-1">Scenario {idx === 0 ? "A" : "B"} Route</p>
                <div className="flex items-center justify-center gap-1 flex-wrap">
                  {r.routeCountries.map((c, i) => (
                    <span key={c} className="flex items-center gap-1 text-[11px]">
                      <span className="text-foreground font-medium">{c}</span>
                      {i < r.routeCountries.length - 1 && <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
