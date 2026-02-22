import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Globe, FileSearch, Shield, Zap, TrendingDown, BarChart3, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/GlassCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useState } from "react";
import { apiService } from "@/services/api";
import { toast } from "sonner";

const features = [
  { icon: FileSearch, title: "AI-Powered Classification", description: "Instant HS code classification with 95%+ accuracy using advanced machine learning" },
  { icon: TrendingDown, title: "Cost Optimization", description: "Identify duty savings opportunities and optimize your supply chain costs" },
  { icon: BarChart3, title: "Real-time Analytics", description: "Complete cost breakdown with interactive visualizations and insights" },
  { icon: Shield, title: "Compliance Engine", description: "Automated compliance checks and FTA eligibility verification" },
  { icon: Zap, title: "Lightning Fast", description: "Get instant results and recommendations in seconds, not hours" },
  { icon: Globe, title: "Global Coverage", description: "Support for 180+ countries and 50+ trade agreements worldwide" },
];

const metrics = [
  { value: 4.2, prefix: "$", suffix: "M", label: "Duty Saved" },
  { value: 94.2, prefix: "", suffix: "%", label: "Accuracy Rate" },
  { value: 180, prefix: "", suffix: "+", label: "Countries" },
  { value: 2.3, prefix: "", suffix: "s", label: "Avg. Response" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: (i ?? 0) * 0.08, duration: 0.5, ease: "easeOut" },
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
      toast.error("Backend connection failed. Make sure backend is running on port 8000.");
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Pill-style nav - dark glass */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[min(90%,640px)] z-50">
        <div className="glass-card flex items-center justify-between px-5 py-3 rounded-[9999px] border border-white/[0.08]">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#ff7e00] to-[#ff4b00] flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-display font-bold tracking-tight">
              Tratle <span className="gradient-text">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={testConnection}
              disabled={connectionStatus === 'testing'}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground rounded-full"
            >
              {connectionStatus === 'testing' && <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />}
              {connectionStatus === 'connected' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
              {connectionStatus === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
              {connectionStatus === 'idle' && 'Test Backend'}
              {connectionStatus === 'testing' && 'Testing...'}
              {connectionStatus === 'connected' && 'Connected'}
              {connectionStatus === 'error' && 'Failed'}
            </Button>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="rounded-full">Platform</Button>
            </Link>
            <Link to="/wizard">
              <Button variant="hero" size="sm" className="rounded-full">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - dark with warm gradient accent */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[length:24px_24px] dot-pattern opacity-40" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[500px] bg-gradient-to-l from-[#ff7e00]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[300px] bg-gradient-to-r from-amber-500/5 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-xs font-medium text-orange-400 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              AI-Powered Trade Intelligence
            </span>
          </motion.div>
          <motion.h1
            className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6 uppercase"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            Optimize Global Trade
            <br />
            <span className="gradient-text">with Intelligence</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            Tradle AI uses advanced AI to classify tariffs, calculate landed costs, and find duty savings across 180+ countries and 50+ trade agreements — in seconds.
          </motion.p>
          <motion.div className="flex items-center justify-center gap-4" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Link to="/wizard">
              <Button variant="hero" size="lg" className="rounded-full">
                Start Analysis <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="hero-outline" size="lg" className="rounded-full border-orange-500/40 text-foreground hover:bg-orange-500/10">
                View Demo Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating metrics - glass cards */}
        <motion.div
          className="relative max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
        >
            {metrics.map((m, i) => (
            <motion.div key={m.label} variants={fadeUp} custom={i + 5}>
              <GlassCard className="text-center py-5 rounded-2xl" hover>
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  <AnimatedCounter value={m.value} prefix={m.prefix} suffix={m.suffix} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{m.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trade route visual */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="relative overflow-hidden h-64 flex items-center justify-center rounded-2xl" hover>
            <div className="absolute inset-0 dot-pattern opacity-20" />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 250" fill="none">
              <motion.path
                d="M 50 180 Q 200 50 400 120 Q 600 190 750 80"
                stroke="url(#routeGrad)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M 80 100 Q 250 200 450 90 Q 600 30 720 150"
                stroke="url(#routeGrad2)"
                strokeWidth="1.5"
                fill="none"
                opacity={0.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
              />
              {[[50, 180], [400, 120], [750, 80], [80, 100], [720, 150]].map(([cx, cy], i) => (
                <motion.circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill="#ff7e00"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + i * 0.2, type: "spring" }}
                />
              ))}
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff7e00" />
                  <stop offset="100%" stopColor="#ff4b00" />
                </linearGradient>
                <linearGradient id="routeGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff4b00" />
                  <stop offset="100%" stopColor="#ff9a56" />
                </linearGradient>
              </defs>
            </svg>
            <div className="relative z-10 text-center">
              <p className="text-sm font-medium text-muted-foreground">Global Trade Route Analysis</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Real-time optimization across 180+ countries</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 uppercase">
              Everything You Need for <span className="gradient-text">Smarter Trade</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From HS classification to landed cost optimization — one platform, complete intelligence.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <GlassCard hover className="h-full rounded-2xl">
                  <div className="w-11 h-11 rounded-xl bg-orange-500/15 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-orange-400" />
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
          <GlassCard className="py-14 rounded-2xl gradient-border" hover>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4 uppercase">Ready to Optimize Your Trade?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Start with a single product analysis and see how Tradle AI can transform your trade operations.</p>
            <Link to="/wizard">
              <Button variant="hero" size="lg" className="rounded-full">
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
            <div className="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Globe className="w-3 h-3 text-orange-400" />
            </div>
            <span className="text-sm font-medium">Tradle <span className="gradient-text">AI</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
