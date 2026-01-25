import { useState, useCallback, useMemo } from 'react';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'hr';
  avatar?: string;
  integrityScore: number;
  strikes: number;
  companies: string[];
  personalConnections: PersonalConnection[];
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  isExclusive: boolean;
  employees: string[];
  projects: string[];
  integrityStatus: 'stable' | 'at-risk' | 'critical';
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  companyId: string;
  status: 'working' | 'temporarily-unavailable' | 'not-working';
  assignedUsers: string[];
  deadline?: Date;
  createdAt: Date;
}

export interface Violation {
  id: string;
  userId: string;
  type: 'exclusivity-breach' | 'missed-deadline' | 'conflict-detected' | 'policy-violation';
  description: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
  resolved: boolean;
}

export interface PersonalConnection {
  id: string;
  name: string;
  type: 'partner' | 'family' | 'friend' | 'business';
  isExclusive: boolean;
  status: 'active' | 'inactive' | 'conflicted';
}

export interface AIAuditResult {
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
  recommendations: string[];
  flaggedUsers: { userId: string; reason: string }[];
  complianceScore: number;
  generatedAt: Date;
}

// Mock Data
const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Sarah Chen',
    email: 'sarah@techcorp.com',
    role: 'admin',
    integrityScore: 98,
    strikes: 0,
    companies: ['c1'],
    personalConnections: [],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'u2',
    name: 'Marcus Johnson',
    email: 'marcus@techcorp.com',
    role: 'employee',
    integrityScore: 85,
    strikes: 1,
    companies: ['c1'],
    personalConnections: [],
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'u3',
    name: 'Emily Rodriguez',
    email: 'emily@techcorp.com',
    role: 'hr',
    integrityScore: 92,
    strikes: 0,
    companies: ['c1'],
    personalConnections: [],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'u4',
    name: 'David Kim',
    email: 'david@techcorp.com',
    role: 'employee',
    integrityScore: 67,
    strikes: 2,
    companies: ['c1', 'c2'],
    personalConnections: [],
    createdAt: new Date('2024-03-01'),
  },
];

const mockCompanies: Company[] = [
  {
    id: 'c1',
    name: 'TechCorp Industries',
    isExclusive: true,
    employees: ['u1', 'u2', 'u3', 'u4'],
    projects: ['p1', 'p2'],
    integrityStatus: 'at-risk',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'c2',
    name: 'StartupXYZ',
    isExclusive: false,
    employees: ['u4'],
    projects: ['p3'],
    integrityStatus: 'stable',
    createdAt: new Date('2024-02-15'),
  },
];

const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Platform Redesign',
    companyId: 'c1',
    status: 'working',
    assignedUsers: ['u1', 'u2'],
    deadline: new Date('2025-03-01'),
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'p2',
    name: 'Mobile App v2',
    companyId: 'c1',
    status: 'temporarily-unavailable',
    assignedUsers: ['u3', 'u4'],
    deadline: new Date('2025-04-15'),
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'p3',
    name: 'MVP Development',
    companyId: 'c2',
    status: 'working',
    assignedUsers: ['u4'],
    createdAt: new Date('2024-02-20'),
  },
];

const mockViolations: Violation[] = [
  {
    id: 'v1',
    userId: 'u2',
    type: 'missed-deadline',
    description: 'Missed Sprint 12 deliverable deadline',
    severity: 'medium',
    createdAt: new Date('2024-12-15'),
    resolved: false,
  },
  {
    id: 'v2',
    userId: 'u4',
    type: 'exclusivity-breach',
    description: 'Joined non-exclusive company while under exclusive contract',
    severity: 'high',
    createdAt: new Date('2025-01-10'),
    resolved: false,
  },
  {
    id: 'v3',
    userId: 'u4',
    type: 'policy-violation',
    description: 'Unauthorized access to confidential project files',
    severity: 'high',
    createdAt: new Date('2025-01-18'),
    resolved: false,
  },
];

export interface ProGuardState {
  currentUser: User | null;
  users: User[];
  companies: Company[];
  projects: Project[];
  violations: Violation[];
  auditResults: AIAuditResult | null;
  mode: 'professional' | 'personal';
  isAuditing: boolean;
}

export function useProGuardState() {
  const [state, setState] = useState<ProGuardState>({
    currentUser: null,
    users: mockUsers,
    companies: mockCompanies,
    projects: mockProjects,
    violations: mockViolations,
    auditResults: null,
    mode: 'professional',
    isAuditing: false,
  });

  // Set current user (login simulation)
  const setCurrentUser = useCallback((userId: string | null) => {
    setState(prev => ({
      ...prev,
      currentUser: userId ? prev.users.find(u => u.id === userId) || null : null,
    }));
  }, []);

  // Switch between Professional and Personal mode
  const setMode = useCallback((mode: 'professional' | 'personal') => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  // Check for exclusivity conflicts
  const checkExclusivityConflict = useCallback((userId: string, companyId: string): boolean => {
    const user = state.users.find(u => u.id === userId);
    const targetCompany = state.companies.find(c => c.id === companyId);
    
    if (!user || !targetCompany) return false;

    // If the target company is exclusive
    if (targetCompany.isExclusive) {
      // Check if user is in any other exclusive company
      const otherExclusiveCompanies = state.companies.filter(
        c => c.id !== companyId && c.isExclusive && user.companies.includes(c.id)
      );
      return otherExclusiveCompanies.length > 0;
    }

    return false;
  }, [state.users, state.companies]);

  // Add a strike to user
  const addStrike = useCallback((userId: string, violation: Omit<Violation, 'id' | 'createdAt'>) => {
    const newViolation: Violation = {
      ...violation,
      id: `v${Date.now()}`,
      createdAt: new Date(),
    };

    setState(prev => {
      const updatedUsers = prev.users.map(u => {
        if (u.id === userId) {
          const newStrikes = u.strikes + 1;
          return {
            ...u,
            strikes: newStrikes,
            integrityScore: Math.max(0, u.integrityScore - (violation.severity === 'high' ? 15 : violation.severity === 'medium' ? 10 : 5)),
          };
        }
        return u;
      });

      return {
        ...prev,
        users: updatedUsers,
        violations: [...prev.violations, newViolation],
      };
    });
  }, []);

  // Run AI Integrity Audit
  const runIntegrityAudit = useCallback(async () => {
    setState(prev => ({ ...prev, isAuditing: true }));

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    const flaggedUsers = state.users
      .filter(u => u.strikes >= 2 || u.integrityScore < 70)
      .map(u => ({
        userId: u.id,
        reason: u.strikes >= 2 
          ? `${u.strikes} strikes accumulated - review for potential removal` 
          : 'Low integrity score indicates compliance concerns',
      }));

    const unresolvedViolations = state.violations.filter(v => !v.resolved);
    const highSeverityCount = unresolvedViolations.filter(v => v.severity === 'high').length;

    const riskLevel: 'low' | 'medium' | 'high' = 
      highSeverityCount >= 2 ? 'high' : 
      unresolvedViolations.length >= 3 ? 'medium' : 'low';

    const auditResult: AIAuditResult = {
      riskLevel,
      summary: riskLevel === 'high' 
        ? 'Critical compliance issues detected. Immediate action required to maintain organizational integrity.'
        : riskLevel === 'medium'
        ? 'Moderate compliance concerns identified. Recommend reviewing flagged users and implementing preventive measures.'
        : 'Organization maintains strong compliance culture. Continue monitoring for potential issues.',
      recommendations: [
        ...(flaggedUsers.length > 0 ? [`Review ${flaggedUsers.length} flagged user(s) for potential quiet quitting or policy violations`] : []),
        ...(highSeverityCount > 0 ? ['Address high-severity violations within 48 hours'] : []),
        'Schedule monthly integrity reviews for at-risk employees',
        'Consider implementing automated deadline reminders',
        'Review exclusivity agreements for clarity',
      ],
      flaggedUsers,
      complianceScore: Math.round(
        state.users.reduce((acc, u) => acc + u.integrityScore, 0) / state.users.length
      ),
      generatedAt: new Date(),
    };

    setState(prev => ({ ...prev, auditResults: auditResult, isAuditing: false }));

    return auditResult;
  }, [state.users, state.violations]);

  // Update project status
  const updateProjectStatus = useCallback((projectId: string, status: Project['status']) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === projectId ? { ...p, status } : p
      ),
    }));
  }, []);

  // Add personal connection
  const addPersonalConnection = useCallback((userId: string, connection: Omit<PersonalConnection, 'id'>) => {
    const newConnection: PersonalConnection = {
      ...connection,
      id: `pc${Date.now()}`,
    };

    setState(prev => ({
      ...prev,
      users: prev.users.map(u => 
        u.id === userId 
          ? { ...u, personalConnections: [...u.personalConnections, newConnection] }
          : u
      ),
    }));
  }, []);

  // Computed values
  const companyStats = useMemo(() => {
    return state.companies.map(company => {
      const employees = state.users.filter(u => u.companies.includes(company.id));
      const avgIntegrity = employees.length 
        ? Math.round(employees.reduce((acc, e) => acc + e.integrityScore, 0) / employees.length)
        : 0;
      const atRiskCount = employees.filter(e => e.strikes >= 2 || e.integrityScore < 70).length;

      return {
        ...company,
        employeeCount: employees.length,
        avgIntegrity,
        atRiskCount,
      };
    });
  }, [state.companies, state.users]);

  return {
    ...state,
    setCurrentUser,
    setMode,
    checkExclusivityConflict,
    addStrike,
    runIntegrityAudit,
    updateProjectStatus,
    addPersonalConnection,
    companyStats,
  };
}
