import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Globe, BarChart3, Shield, Zap, TrendingDown, FileSearch, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/GlassCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useState } from "react";
import { apiService } from "@/services/api";
import { toast } from "sonner";

const features = [
  { icon: FileSearch, title: "HS Classification", description: "AI-powered tariff code recommendations with 94%+ confidence scoring" },
  { icon: TrendingDown, title: "Duty Optimization", description: "Identify FTA savings and reduce landed costs across trade agreements" },
  { icon: BarChart3, title: "Landed Cost Analysis", description: "Complete cost breakdown with real-time shipping and duty calculations" },
  { icon: Shield, title: "Compliance Engine", description: "Automated compliance checks and origin qualification verification" },
  { icon: Zap, title: "Scenario Simulator", description: "Compare HS codes, trade routes, and shipping modes instantly" },
  { icon: Globe, title: "Global Coverage", description: "Support for 180+ countries, 50+ trade agreements, and all shipping modes" },
];

const metrics = [
  { value: 4250, prefix: "$", suffix: "", label: "Avg. Duty Savings" },
  { value: 94, prefix: "", suffix: "%", label: "Classification Accuracy" },
  { value: 180, prefix: "", suffix: "+", label: "Countries Covered" },
  { value: 12, prefix: "", suffix: "s", label: "Analysis Time" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function Landing() {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const response = await apiService.testConnection();
      if (response.status === "Frontend-Backend Integration Working") {
        setConnectionStatus('connected');
        toast.success("Backend connection successful!");
      } else {
        setConnectionStatus('error');
        toast.error("Unexpected response from backend");
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error("Backend connection failed. Make sure the backend is running on port 8000.");
    }
  };
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Tradle <span className="glow-text-purple">AI</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={testConnection}
              disabled={connectionStatus === 'testing'}
              className="flex items-center gap-2"
            >
              {connectionStatus === 'testing' && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              )}
              {connectionStatus === 'connected' && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {connectionStatus === 'error' && (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              {connectionStatus === 'idle' && 'Test Backend'}
              {connectionStatus === 'testing' && 'Testing...'}
              {connectionStatus === 'connected' && 'Connected'}
              {connectionStatus === 'error' && 'Connection Failed'}
            </Button>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Platform</Button>
            </Link>
            <Link to="/wizard">
              <Button variant="hero" size="sm">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px]" style={{ background: "var(--gradient-glow-purple)" }} />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px]" style={{ background: "var(--gradient-glow-teal)" }} />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs font-medium text-primary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              AI-Powered Trade Intelligence
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            Optimize Global Trade
            <br />
            <span className="glow-text-mixed">with Intelligence</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            Tradle AI uses advanced AI to classify tariffs, calculate landed costs, and find duty savings across 180+ countries and 50+ trade agreements — in seconds.
          </motion.p>

          <motion.div className="flex items-center justify-center gap-4" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Link to="/wizard">
              <Button variant="hero" size="lg">
                Start Analysis <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="hero-outline" size="lg">View Demo Dashboard</Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating metrics */}
        <motion.div
          className="relative max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="hidden" animate="visible"
        >
          {metrics.map((m, i) => (
            <motion.div key={m.label} variants={fadeUp} custom={i + 4}>
              <GlassCard className="text-center py-5" hover>
                <div className="text-3xl font-bold text-foreground">
                  <AnimatedCounter value={m.value} prefix={m.prefix} suffix={m.suffix} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{m.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trade route animation placeholder */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="relative overflow-hidden h-64 flex items-center justify-center">
            <div className="absolute inset-0 dot-pattern opacity-20" />
            {/* Animated route lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 250" fill="none">
              <motion.path
                d="M 50 180 Q 200 50 400 120 Q 600 190 750 80"
                stroke="url(#routeGrad)" strokeWidth="2" fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M 80 100 Q 250 200 450 90 Q 600 30 720 150"
                stroke="url(#routeGrad2)" strokeWidth="1.5" fill="none" opacity={0.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
              />
              {/* Nodes */}
              {[[50, 180], [400, 120], [750, 80], [80, 100], [720, 150]].map(([cx, cy], i) => (
                <motion.circle
                  key={i} cx={cx} cy={cy} r="4" fill="hsl(265 90% 60%)"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 1 + i * 0.2, type: "spring" }}
                />
              ))}
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(265 90% 60%)" />
                  <stop offset="100%" stopColor="hsl(175 80% 45%)" />
                </linearGradient>
                <linearGradient id="routeGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(175 80% 45%)" />
                  <stop offset="100%" stopColor="hsl(265 90% 60%)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="relative z-10 text-center">
              <p className="text-sm font-medium text-muted-foreground">Global Trade Route Analysis</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Real-time optimization across 180+ countries</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for <span className="glow-text-purple">Smarter Trade</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From HS classification to landed cost optimization — one platform, complete intelligence.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <GlassCard hover className="h-full">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <GlassCard className="py-14 gradient-border">
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Trade?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Start with a single product analysis and see how Tradle AI can transform your trade operations.</p>
            <Link to="/wizard">
              <Button variant="hero" size="lg">
                Start Free Analysis <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-sm text-muted-foreground">© 2026 Tradle AI. AI-Powered Trade Intelligence.</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
              <Globe className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm font-medium">Tradle <span className="glow-text-purple">AI</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
