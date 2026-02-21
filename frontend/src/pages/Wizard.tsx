import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Upload, Plane, Ship, Truck, Package, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from "@/components/GlassCard";
import { cn } from "@/lib/utils";

const steps = ["Product Details", "Trade Route", "Shipment Info", "BOM Upload", "Review"];

const shippingModes = [
  { id: "air" as const, label: "Air Freight", icon: Plane, transit: "2-5 days" },
  { id: "sea" as const, label: "Sea Freight", icon: Ship, transit: "20-35 days" },
  { id: "land" as const, label: "Land Freight", icon: Truck, transit: "7-14 days" },
];

interface FormData {
  productDescription: string;
  exportCountry: string;
  importCountry: string;
  quantity: string;
  value: string;
  currency: string;
  weight: string;
  shippingMode: "air" | "sea" | "land";
  bomFile: File | null;
  bomPreview: string[][];
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
};

export default function Wizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormData>({
    productDescription: "Portable laptop computer, 14-inch display, Intel i7 processor, 16GB RAM, assembled in Mexico with US and Asian components",
    exportCountry: "Mexico",
    importCountry: "United States",
    quantity: "500",
    value: "250",
    currency: "USD",
    weight: "1.8",
    shippingMode: "sea",
    bomFile: null,
    bomPreview: [
      ["Component", "Origin", "HS Code", "Value (USD)"],
      ["Intel i7 CPU", "United States", "8542.31", "85.00"],
      ["Samsung DDR5 RAM", "South Korea", "8542.32", "32.00"],
      ["LG Display Panel", "South Korea", "9013.80", "45.00"],
      ["Battery Pack", "China", "8507.60", "28.00"],
      ["Chassis Assembly", "Mexico", "7616.99", "18.00"],
    ],
  });

  const update = useCallback((key: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const next = () => { setDirection(1); setStep((s) => Math.min(s + 1, steps.length - 1)); };
  const prev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) update("bomFile", file);
  };

  const submit = () => navigate("/dashboard");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Data Ingestion</h1>
        <p className="text-sm text-muted-foreground">Provide product and trade details for AI analysis</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 shrink-0",
              i < step ? "bg-primary text-primary-foreground" :
              i === step ? "bg-primary/20 text-primary border border-primary/50" :
              "bg-muted text-muted-foreground"
            )}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-0.5 flex-1 rounded transition-colors duration-300", i < step ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-6 font-medium">{steps[step]}</p>

      {/* Step content */}
      <GlassCard className="min-h-[340px] relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Product Description</Label>
                  <textarea
                    value={form.productDescription}
                    onChange={(e) => update("productDescription", e.target.value)}
                    className="w-full h-32 rounded-lg bg-muted/50 border border-border p-3 text-sm text-foreground resize-none focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="Describe the product in detail..."
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-primary" />Export Country</Label>
                    <Input value={form.exportCountry} onChange={(e) => update("exportCountry", e.target.value)} className="bg-muted/50" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-accent" />Import Country</Label>
                    <Input value={form.importCountry} onChange={(e) => update("importCountry", e.target.value)} className="bg-muted/50" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Quantity</Label>
                    <Input type="number" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} className="bg-muted/50" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Unit Value ({form.currency})</Label>
                    <Input type="number" value={form.value} onChange={(e) => update("value", e.target.value)} className="bg-muted/50" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Weight (kg per unit)</Label>
                    <Input type="number" value={form.weight} onChange={(e) => update("weight", e.target.value)} className="bg-muted/50" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Currency</Label>
                    <Input value={form.currency} onChange={(e) => update("currency", e.target.value)} className="bg-muted/50" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-3 block">Shipping Mode</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {shippingModes.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => update("shippingMode", m.id)}
                        className={cn(
                          "glass-card p-4 text-center transition-all duration-300 cursor-pointer",
                          form.shippingMode === m.id
                            ? "border-primary/50 shadow-[var(--shadow-glow-purple)]"
                            : "hover:border-border/80"
                        )}
                      >
                        <motion.div
                          animate={form.shippingMode === m.id ? { y: [0, -4, 0] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <m.icon className={cn("w-6 h-6 mx-auto mb-2", form.shippingMode === m.id ? "text-primary" : "text-muted-foreground")} />
                        </motion.div>
                        <p className="text-xs font-medium">{m.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{m.transit}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
                  <label className="cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium">Upload Bill of Materials (CSV)</p>
                    <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to browse</p>
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {form.bomPreview.length > 0 && (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted/50">
                          {form.bomPreview[0].map((h, i) => (
                            <th key={i} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {form.bomPreview.slice(1).map((row, ri) => (
                          <tr key={ri} className="border-t border-border">
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-3 py-2 text-foreground">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-primary" />Review Your Submission</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Product", form.productDescription.slice(0, 60) + "..."],
                    ["Route", `${form.exportCountry} → ${form.importCountry}`],
                    ["Quantity", `${form.quantity} units @ $${form.value}`],
                    ["Weight", `${form.weight} kg/unit`],
                    ["Shipping", form.shippingMode.charAt(0).toUpperCase() + form.shippingMode.slice(1) + " freight"],
                    ["BOM", form.bomPreview.length > 1 ? `${form.bomPreview.length - 1} components` : "Not uploaded"],
                  ].map(([label, val]) => (
                    <div key={label} className="glass-card p-3">
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      <p className="font-medium text-foreground text-xs">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </GlassCard>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="ghost" onClick={prev} disabled={step === 0}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        {step < steps.length - 1 ? (
          <Button variant="default" onClick={next}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="hero" onClick={submit}>
            Run Analysis <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
