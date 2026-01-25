import { motion } from 'framer-motion';
import { Shield, Users, Brain, AlertTriangle, ChevronRight, Lock, Eye, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IntegrityMeter } from './IntegrityMeter';

interface LandingPageProps {
  onEnterPlatform: () => void;
}

export function LandingPage({ onEnterPlatform }: LandingPageProps) {
  const features = [
    {
      icon: Shield,
      title: 'Verifiable Integrity',
      description: 'Track commitments, not keystrokes. Our rule-based system ensures accountability without invasive surveillance.',
    },
    {
      icon: Users,
      title: 'Dual-Mode Interface',
      description: 'Separate professional duties from personal life with distinct dashboards and visual themes.',
    },
    {
      icon: Brain,
      title: 'AI Intelligence Hub',
      description: 'Automated integrity audits powered by advanced AI. Get risk assessments and actionable recommendations.',
    },
    {
      icon: AlertTriangle,
      title: 'Strike System',
      description: '3-strike warning system for compliance violations. Transparent, fair, and automatically enforced.',
    },
  ];

  const stats = [
    { value: '98%', label: 'Compliance Rate' },
    { value: '2.5x', label: 'Productivity Increase' },
    { value: '0', label: 'Privacy Violations' },
    { value: '24/7', label: 'Monitoring' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <header className="relative">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
        
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="p-2 rounded-xl bg-primary text-primary-foreground">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">ProGuard</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button onClick={onEnterPlatform} className="gap-2">
              Enter Platform
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Lock className="w-4 h-4" />
                Next-Gen Integrity Management
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Trust Through{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Verifiable Integrity
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                ProGuard bridges the trust gap in remote work. Track commitments, not surveillance. 
                Ensure exclusivity compliance with rule-based accountability.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={onEnterPlatform} className="gap-2">
                  Get Started
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Eye className="w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="high-gloss-card rounded-3xl p-8 lg:p-12">
                <div className="flex flex-col items-center">
                  <IntegrityMeter score={92} size="lg" />
                  <h3 className="text-xl font-semibold mt-6 mb-2">Organization Health</h3>
                  <p className="text-muted-foreground text-center">
                    Real-time integrity monitoring across all teams
                  </p>
                </div>
                
                {/* Floating badges */}
                <motion.div 
                  className="absolute -top-4 -right-4 bg-card border shadow-lg rounded-xl px-4 py-2"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium">All Systems Normal</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-4 -left-4 bg-card border shadow-lg rounded-xl px-4 py-2"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 1.5 }}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">+15% This Month</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Rule-Based Accountability
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Move away from invasive surveillance. ProGuard ensures commitment compliance 
              through transparent, data-driven alerts.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="high-gloss-card rounded-2xl p-6 group hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Build Trust?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join organizations that prioritize integrity over surveillance. 
              Start your ProGuard journey today.
            </p>
            <Button size="lg" onClick={onEnterPlatform} className="gap-2">
              Enter the Platform
              <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold">ProGuard</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 ProGuard. Verifiable Integrity for the Modern Workforce.
          </p>
        </div>
      </footer>
    </div>
  );
}
