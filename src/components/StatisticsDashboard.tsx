import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
} from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid,
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  CheckCircle, 
  Archive,
  Trash2,
  Calendar
} from 'lucide-react';
import { 
  StatisticsService, 
  PERIODS, 
  RequestStats, 
  StatusDistribution, 
  PeriodSummary 
} from '@/services/statisticsService';
import { useToast } from '@/hooks/use-toast';

const StatisticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[1].value); // Default to 7 days
  const [dailyStats, setDailyStats] = useState<RequestStats[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<StatusDistribution[]>([]);
  const [periodSummary, setPeriodSummary] = useState<PeriodSummary | null>(null);
  const [periodsComparison, setPeriodsComparison] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const currentPeriod = PERIODS.find(p => p.value === selectedPeriod) || PERIODS[1];

  useEffect(() => {
    loadStatistics();
  }, [selectedPeriod]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const days = parseInt(selectedPeriod);
      
      const [daily, distribution, summary, comparison] = await Promise.all([
        StatisticsService.getDailyStats(days),
        StatisticsService.getStatusDistribution(days),
        StatisticsService.getPeriodSummary(days),
        StatisticsService.getPeriodsComparison()
      ]);

      setDailyStats(daily);
      setStatusDistribution(distribution);
      setPeriodSummary(summary);
      setPeriodsComparison(comparison);
    } catch (error) {
      console.error('Error loading statistics:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    pending: {
      label: "En attente",
      color: "hsl(var(--warning))",
    },
    processing: {
      label: "En cours",
      color: "hsl(var(--info))",
    },
    completed: {
      label: "Traitées",
      color: "hsl(var(--success))",
    },
    archived: {
      label: "Archivées",
      color: "hsl(var(--muted))",
    },
    deleted: {
      label: "Supprimées",
      color: "hsl(var(--destructive))",
    },
    total: {
      label: "Total",
      color: "hsl(var(--primary))",
    },
  };

  const statusColors = {
    pending: "#eab308",
    processing: "#3b82f6", 
    completed: "#22c55e",
    archived: "#6b7280",
    deleted: "#ef4444"
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Chargement des statistiques...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Statistiques des demandes</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map(period => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      {periodSummary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-2xl font-bold">{periodSummary.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{periodSummary.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">En cours</p>
                  <p className="text-2xl font-bold text-blue-600">{periodSummary.processing}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Traitées</p>
                  <p className="text-2xl font-bold text-green-600">{periodSummary.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Archive className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Archivées</p>
                  <p className="text-2xl font-bold text-gray-600">{periodSummary.archived}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trash2 className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Supprimées</p>
                  <p className="text-2xl font-bold text-red-600">{periodSummary.deleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Evolution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Évolution quotidienne ({currentPeriod.label})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution.filter(item => item.count > 0)}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ label, percentage }) => `${label}: ${percentage}%`}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={statusColors[entry.status as keyof typeof statusColors]} 
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Détail par statut ({currentPeriod.label})</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="pending" stackId="a" fill={statusColors.pending} />
                <Bar dataKey="processing" stackId="a" fill={statusColors.processing} />
                <Bar dataKey="completed" stackId="a" fill={statusColors.completed} />
                <Bar dataKey="archived" stackId="a" fill={statusColors.archived} />
                <Bar dataKey="deleted" stackId="a" fill={statusColors.deleted} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Periods Comparison */}
      {periodsComparison && (
        <Card>
          <CardHeader>
            <CardTitle>Comparaison des périodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold">Aujourd'hui</h4>
                <p className="text-2xl font-bold text-primary">{periodsComparison.today.total}</p>
                <div className="text-xs text-muted-foreground mt-1">
                  {periodsComparison.today.pending} en attente
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold">7 jours</h4>
                <p className="text-2xl font-bold text-primary">{periodsComparison.week.total}</p>
                <div className="text-xs text-muted-foreground mt-1">
                  {periodsComparison.week.pending} en attente
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold">30 jours</h4>
                <p className="text-2xl font-bold text-primary">{periodsComparison.month.total}</p>
                <div className="text-xs text-muted-foreground mt-1">
                  {periodsComparison.month.pending} en attente
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold">1 année</h4>
                <p className="text-2xl font-bold text-primary">{periodsComparison.year.total}</p>
                <div className="text-xs text-muted-foreground mt-1">
                  {periodsComparison.year.pending} en attente
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatisticsDashboard;