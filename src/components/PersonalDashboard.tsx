import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Users, UserPlus, Shield, Home, Briefcase,
  CheckCircle2, AlertTriangle, Lock, User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { IntegrityMeter } from './IntegrityMeter';
import type { User, PersonalConnection } from '@/hooks/useProGuardState';

interface PersonalDashboardProps {
  currentUser: User;
  onAddConnection: (connection: Omit<PersonalConnection, 'id'>) => void;
  onSwitchToProfessional: () => void;
  onLogout: () => void;
}

export function PersonalDashboard({
  currentUser,
  onAddConnection,
  onSwitchToProfessional,
  onLogout,
}: PersonalDashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'friend' as PersonalConnection['type'],
    isExclusive: false,
  });

  const handleAddConnection = () => {
    if (newConnection.name.trim()) {
      // Check for exclusive conflicts
      const hasExclusiveConflict = newConnection.isExclusive && 
        currentUser.personalConnections.some(c => c.isExclusive && c.type === newConnection.type);

      onAddConnection({
        ...newConnection,
        status: hasExclusiveConflict ? 'conflicted' : 'active',
      });

      setNewConnection({ name: '', type: 'friend', isExclusive: false });
      setShowAddForm(false);
    }
  };

  const getTypeIcon = (type: PersonalConnection['type']) => {
    switch (type) {
      case 'partner': return Heart;
      case 'family': return Users;
      case 'friend': return UserIcon;
      case 'business': return Briefcase;
    }
  };

  const getStatusBadge = (status: PersonalConnection['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'conflicted':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Conflicted</Badge>;
    }
  };

  // Calculate personal integrity score based on connections
  const personalIntegrityScore = Math.max(0, 
    100 - (currentUser.personalConnections.filter(c => c.status === 'conflicted').length * 15)
  );

  return (
    <div className="min-h-screen bg-background personal-mode">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg">ProGuard</h1>
                <p className="text-xs text-muted-foreground">Personal Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onSwitchToProfessional} className="gap-2">
                <Briefcase className="w-4 h-4" />
                Professional Mode
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <Home className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Personal Integrity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="high-gloss-card h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Personal Integrity
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <IntegrityMeter score={personalIntegrityScore} size="lg" />
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Your personal commitment score reflects how well you manage your private connections.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="high-gloss-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Connection Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-muted/50 rounded-xl">
                    <p className="text-3xl font-bold text-primary">
                      {currentUser.personalConnections.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Connections</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-xl">
                    <p className="text-3xl font-bold">
                      {currentUser.personalConnections.filter(c => c.isExclusive).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Exclusive</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-xl">
                    <p className="text-3xl font-bold text-green-500">
                      {currentUser.personalConnections.filter(c => c.status === 'active').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Active</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-xl">
                    <p className="text-3xl font-bold text-red-500">
                      {currentUser.personalConnections.filter(c => c.status === 'conflicted').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Conflicts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Connections Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="high-gloss-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Personal Connections</CardTitle>
              <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add Connection
              </Button>
            </CardHeader>
            <CardContent>
              {/* Add Form */}
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-muted/50 rounded-xl"
                >
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter name"
                        value={newConnection.name}
                        onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={newConnection.type}
                        onValueChange={(value) => setNewConnection({ ...newConnection, type: value as PersonalConnection['type'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="partner">Partner</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="exclusive"
                        checked={newConnection.isExclusive}
                        onCheckedChange={(checked) => setNewConnection({ ...newConnection, isExclusive: checked })}
                      />
                      <Label htmlFor="exclusive" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Mark as Exclusive
                      </Label>
                    </div>
                  </div>

                  {newConnection.isExclusive && currentUser.personalConnections.some(c => c.isExclusive && c.type === newConnection.type) && (
                    <div className="flex items-center gap-2 text-sm text-destructive mb-4 p-2 bg-destructive/10 rounded-lg">
                      <AlertTriangle className="w-4 h-4" />
                      Warning: You already have an exclusive {newConnection.type} connection. This will create a conflict.
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    <Button onClick={handleAddConnection}>Add Connection</Button>
                  </div>
                </motion.div>
              )}

              {/* Connections List */}
              {currentUser.personalConnections.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No personal connections yet</p>
                  <p className="text-sm text-muted-foreground">Add connections to track your personal commitments</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {currentUser.personalConnections.map((connection, index) => {
                    const Icon = getTypeIcon(connection.type);
                    return (
                      <motion.div
                        key={connection.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-xl border ${
                          connection.status === 'conflicted' ? 'border-destructive/50 bg-destructive/5' : 'bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            connection.status === 'conflicted' ? 'bg-destructive/10' : 'bg-primary/10'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              connection.status === 'conflicted' ? 'text-destructive' : 'text-primary'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{connection.name}</h3>
                              {connection.isExclusive && (
                                <Lock className="w-3 h-3 text-primary" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize text-xs">
                                {connection.type}
                              </Badge>
                              {getStatusBadge(connection.status)}
                            </div>
                          </div>
                          {connection.status === 'active' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : connection.status === 'conflicted' ? (
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                          ) : null}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-muted/50 rounded-xl text-center"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            Your personal connections are private and never shared with employers
          </div>
        </motion.div>
      </main>
    </div>
  );
}
