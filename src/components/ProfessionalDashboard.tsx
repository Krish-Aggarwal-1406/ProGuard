import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Building2, Users, FolderKanban, AlertTriangle, 
  Brain, ChevronRight, Clock, CheckCircle2, XCircle,
  TrendingUp, TrendingDown, RefreshCw, Home, User as UserIcon,
  BarChart3, FileWarning, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { IntegrityMeter } from './IntegrityMeter';
import type { User, Company, Project, Violation, AIAuditResult } from '@/hooks/useProGuardState';

interface ProfessionalDashboardProps {
  currentUser: User;
  users: User[];
  companies: Company[];
  projects: Project[];
  violations: Violation[];
  auditResults: AIAuditResult | null;
  isAuditing: boolean;
  companyStats: Array<Company & { employeeCount: number; avgIntegrity: number; atRiskCount: number }>;
  onRunAudit: () => Promise<AIAuditResult>;
  onUpdateProjectStatus: (projectId: string, status: Project['status']) => void;
  onSwitchToPersonal: () => void;
  onLogout: () => void;
}

export function ProfessionalDashboard({
  currentUser,
  users,
  companies,
  projects,
  violations,
  auditResults,
  isAuditing,
  companyStats,
  onRunAudit,
  onUpdateProjectStatus,
  onSwitchToPersonal,
  onLogout,
}: ProfessionalDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const unresolvedViolations = violations.filter(v => !v.resolved);
  const myCompany = companyStats.find(c => currentUser.companies.includes(c.id));

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'working': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'temporarily-unavailable': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'not-working': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'working': return 'Working';
      case 'temporarily-unavailable': return 'Temp. Unavailable';
      case 'not-working': return 'Not Working';
    }
  };

  const getSeverityColor = (severity: Violation['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg">ProGuard</h1>
                <p className="text-xs text-muted-foreground">Professional Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onSwitchToPersonal} className="gap-2">
                <UserIcon className="w-4 h-4" />
                Personal Mode
              </Button>
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <Home className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FolderKanban className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="workforce" className="gap-2">
              <Users className="w-4 h-4" />
              Workforce
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="gap-2">
              <Brain className="w-4 h-4" />
              Intelligence Hub
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Integrity Score Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="high-gloss-card h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Integrity</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <IntegrityMeter score={currentUser.integrityScore} size="lg" />
                    <div className="mt-4 flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{currentUser.strikes}</p>
                        <p className="text-xs text-muted-foreground">Strikes</p>
                      </div>
                      <div className="w-px h-10 bg-border" />
                      <div className="text-center">
                        <p className="text-2xl font-bold">{currentUser.companies.length}</p>
                        <p className="text-xs text-muted-foreground">Companies</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Company Health Card */}
              {myCompany && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="high-gloss-card h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Organization Health</CardTitle>
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Avg. Integrity</span>
                            <span className="font-semibold">{myCompany.avgIntegrity}%</span>
                          </div>
                          <Progress value={myCompany.avgIntegrity} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <p className="text-2xl font-bold">{myCompany.employeeCount}</p>
                            <p className="text-xs text-muted-foreground">Total Employees</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-destructive">{myCompany.atRiskCount}</p>
                            <p className="text-xs text-muted-foreground">At Risk</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <div className="flex items-center gap-2">
                            {myCompany.isExclusive ? (
                              <Badge variant="default" className="gap-1">
                                <Shield className="w-3 h-3" />
                                Exclusive
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Non-Exclusive</Badge>
                            )}
                            <Badge 
                              variant="outline"
                              className={
                                myCompany.integrityStatus === 'stable' ? 'border-green-500 text-green-500' :
                                myCompany.integrityStatus === 'at-risk' ? 'border-yellow-500 text-yellow-500' :
                                'border-red-500 text-red-500'
                              }
                            >
                              {myCompany.integrityStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Recent Violations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="high-gloss-card h-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Recent Violations</CardTitle>
                    <FileWarning className="w-5 h-5 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    {unresolvedViolations.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No active violations</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {unresolvedViolations.slice(0, 3).map((violation) => {
                          const user = users.find(u => u.id === violation.userId);
                          return (
                            <div key={violation.id} className="p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getSeverityColor(violation.severity)}>
                                  {violation.severity}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {violation.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm font-medium">{user?.name}</p>
                              <p className="text-xs text-muted-foreground">{violation.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => {
                const company = companies.find(c => c.id === project.companyId);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="high-gloss-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          {getStatusIcon(project.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{company?.name}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{getStatusLabel(project.status)}</Badge>
                            {project.deadline && (
                              <span className="text-xs text-muted-foreground">
                                Due: {project.deadline.toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Assigned ({project.assignedUsers.length})</p>
                            <div className="flex -space-x-2">
                              {project.assignedUsers.slice(0, 4).map((userId) => {
                                const user = users.find(u => u.id === userId);
                                return (
                                  <div
                                    key={userId}
                                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-card"
                                    title={user?.name}
                                  >
                                    <span className="text-xs font-medium">
                                      {user?.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {(currentUser.role === 'admin' || currentUser.role === 'hr') && (
                            <div className="pt-4 border-t">
                              <p className="text-xs text-muted-foreground mb-2">Update Status</p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant={project.status === 'working' ? 'default' : 'outline'}
                                  onClick={() => onUpdateProjectStatus(project.id, 'working')}
                                >
                                  Working
                                </Button>
                                <Button
                                  size="sm"
                                  variant={project.status === 'temporarily-unavailable' ? 'default' : 'outline'}
                                  onClick={() => onUpdateProjectStatus(project.id, 'temporarily-unavailable')}
                                >
                                  Paused
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Workforce Tab */}
          <TabsContent value="workforce">
            <div className="grid md:grid-cols-2 gap-6">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`high-gloss-card ${user.strikes >= 2 ? 'border-destructive/50' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserIcon className="w-8 h-8 text-primary" />
                          </div>
                          {user.strikes >= 2 && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-destructive flex items-center justify-center">
                              <AlertTriangle className="w-3 h-3 text-destructive-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge variant="outline" className="capitalize">{user.role}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{user.email}</p>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-lg font-bold">{user.integrityScore}</p>
                              <p className="text-xs text-muted-foreground">Integrity</p>
                            </div>
                            <div>
                              <p className={`text-lg font-bold ${user.strikes >= 2 ? 'text-destructive' : ''}`}>
                                {user.strikes}/3
                              </p>
                              <p className="text-xs text-muted-foreground">Strikes</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold">{user.companies.length}</p>
                              <p className="text-xs text-muted-foreground">Companies</p>
                            </div>
                          </div>
                        </div>

                        <IntegrityMeter score={user.integrityScore} size="sm" showLabel={false} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Intelligence Hub Tab */}
          <TabsContent value="intelligence">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Audit Trigger */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="high-gloss-card">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>AI Intelligence Hub</CardTitle>
                        <p className="text-sm text-muted-foreground">Powered by Advanced AI</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">
                      Run an automated integrity audit to analyze compliance patterns, 
                      detect potential risks, and receive actionable recommendations.
                    </p>

                    <Button 
                      className="w-full gap-2" 
                      size="lg"
                      onClick={onRunAudit}
                      disabled={isAuditing}
                    >
                      {isAuditing ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Run Integrity Audit
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Audit Results */}
              <AnimatePresence>
                {auditResults && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className={`high-gloss-card ${
                      auditResults.riskLevel === 'high' ? 'danger-glow' :
                      auditResults.riskLevel === 'medium' ? 'warning-glow' :
                      'integrity-glow'
                    }`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Audit Results</CardTitle>
                          <Badge 
                            className={`uppercase ${
                              auditResults.riskLevel === 'high' ? 'bg-red-500' :
                              auditResults.riskLevel === 'medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                          >
                            {auditResults.riskLevel} Risk
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Generated: {auditResults.generatedAt.toLocaleString()}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm">{auditResults.summary}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              Compliance Score
                            </p>
                            <div className="flex items-center gap-4">
                              <Progress value={auditResults.complianceScore} className="flex-1 h-3" />
                              <span className="font-bold">{auditResults.complianceScore}%</span>
                            </div>
                          </div>

                          {auditResults.flaggedUsers.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-destructive" />
                                Flagged Users
                              </p>
                              <div className="space-y-2">
                                {auditResults.flaggedUsers.map((flagged) => {
                                  const user = users.find(u => u.id === flagged.userId);
                                  return (
                                    <div key={flagged.userId} className="p-2 bg-destructive/10 rounded-lg">
                                      <p className="text-sm font-medium">{user?.name}</p>
                                      <p className="text-xs text-muted-foreground">{flagged.reason}</p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div>
                            <p className="text-sm font-medium mb-2">Recommendations</p>
                            <ul className="space-y-1">
                              {auditResults.recommendations.map((rec, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
