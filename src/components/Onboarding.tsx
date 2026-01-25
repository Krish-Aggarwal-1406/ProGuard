import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle2, User, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { User as UserType } from '@/hooks/useProGuardState';

interface OnboardingProps {
  users: UserType[];
  onSelectUser: (userId: string) => void;
}

const integrityOath = [
  "I commit to maintaining professional exclusivity as agreed with my organization.",
  "I will complete assigned tasks within established deadlines.",
  "I understand that violations may result in strikes against my integrity record.",
  "I will use ProGuard to track my commitments honestly and transparently.",
];

export function Onboarding({ users, onSelectUser }: OnboardingProps) {
  const [step, setStep] = useState<'select' | 'oath' | 'complete'>('select');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean[]>(new Array(integrityOath.length).fill(false));

  const handleUserSelect = (user: UserType) => {
    setSelectedUser(user);
    setStep('oath');
  };

  const handleAcceptTerm = (index: number) => {
    const newAccepted = [...acceptedTerms];
    newAccepted[index] = true;
    setAcceptedTerms(newAccepted);
  };

  const allTermsAccepted = acceptedTerms.every(Boolean);

  const handleComplete = () => {
    if (selectedUser && allTermsAccepted) {
      setStep('complete');
      setTimeout(() => {
        onSelectUser(selectedUser.id);
      }, 1500);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'hr': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl"
          >
            <div className="text-center mb-8">
              <motion.div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <Shield className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">Welcome to ProGuard</h1>
              <p className="text-muted-foreground">Select your profile to continue</p>
            </div>

            <div className="grid gap-4">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card 
                    className="p-4 cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{user.integrityScore}</div>
                        <div className="text-xs text-muted-foreground">Integrity Score</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'oath' && selectedUser && (
          <motion.div
            key="oath"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-xl"
          >
            <div className="text-center mb-8">
              <motion.div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 150 }}
              >
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-2">The Integrity Oath</h1>
              <p className="text-muted-foreground">
                Welcome, <span className="font-medium text-foreground">{selectedUser.name}</span>. 
                Accept each commitment to proceed.
              </p>
            </div>

            <Card className="p-6 mb-6">
              <div className="space-y-4">
                {integrityOath.map((term, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <button
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        acceptedTerms[index] 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => handleAcceptTerm(index)}
                      disabled={acceptedTerms[index]}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          acceptedTerms[index] ? 'bg-primary' : 'bg-muted'
                        }`}>
                          {acceptedTerms[index] ? (
                            <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                          ) : (
                            <span className="text-xs font-medium text-muted-foreground">{index + 1}</span>
                          )}
                        </div>
                        <p className={`text-sm ${acceptedTerms[index] ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {term}
                        </p>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </Card>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setStep('select');
                  setSelectedUser(null);
                  setAcceptedTerms(new Array(integrityOath.length).fill(false));
                }}
              >
                Back
              </Button>
              <Button 
                className="flex-1 gap-2"
                disabled={!allTermsAccepted}
                onClick={handleComplete}
              >
                Begin Journey
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">Oath Accepted</h1>
            <p className="text-muted-foreground">Entering ProGuard...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
