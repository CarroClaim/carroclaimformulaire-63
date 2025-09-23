import { supabase } from "@/integrations/supabase/client";

export interface StatisticsPeriod {
  label: string;
  value: string;
  days: number;
}

export interface RequestStats {
  date: string;
  pending: number;
  processing: number;
  completed: number;
  archived: number;
  deleted: number;
  total: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  label: string;
}

export interface PeriodSummary {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  archived: number;
  deleted: number;
}

export const PERIODS: StatisticsPeriod[] = [
  { label: "Aujourd'hui", value: "1", days: 1 },
  { label: "7 jours", value: "7", days: 7 },
  { label: "30 jours", value: "30", days: 30 },
  { label: "1 année", value: "365", days: 365 },
];

export class StatisticsService {
  /**
   * Get daily statistics for the specified period
   */
  static async getDailyStats(days: number): Promise<RequestStats[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('requests')
      .select('created_at, status')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by date and status
    const statsMap = new Map<string, RequestStats>();
    
    // Initialize all dates with zero counts
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      statsMap.set(dateKey, {
        date: dateKey,
        pending: 0,
        processing: 0,
        completed: 0,
        archived: 0,
        deleted: 0,
        total: 0
      });
    }

    // Fill with actual data
    data?.forEach(request => {
      const dateKey = request.created_at.split('T')[0];
      const stats = statsMap.get(dateKey);
      
      if (stats) {
        stats[request.status as keyof Omit<RequestStats, 'date' | 'total'>]++;
        stats.total++;
      }
    });

    return Array.from(statsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get status distribution for the specified period
   */
  static async getStatusDistribution(days: number): Promise<StatusDistribution[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('requests')
      .select('status')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const statusCounts = {
      pending: 0,
      processing: 0,
      completed: 0,
      archived: 0,
      deleted: 0
    };

    data?.forEach(request => {
      statusCounts[request.status as keyof typeof statusCounts]++;
    });

    const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

    const statusLabels = {
      pending: 'En attente',
      processing: 'En cours',
      completed: 'Traitées',
      archived: 'Archivées',
      deleted: 'Supprimées'
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      label: statusLabels[status as keyof typeof statusLabels]
    }));
  }

  /**
   * Get summary statistics for the specified period
   */
  static async getPeriodSummary(days: number): Promise<PeriodSummary> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('requests')
      .select('status')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const summary: PeriodSummary = {
      total: data?.length || 0,
      pending: 0,
      processing: 0,
      completed: 0,
      archived: 0,
      deleted: 0
    };

    data?.forEach(request => {
      summary[request.status as keyof Omit<PeriodSummary, 'total'>]++;
    });

    return summary;
  }

  /**
   * Get comparison data between periods
   */
  static async getPeriodsComparison(): Promise<{
    today: PeriodSummary;
    week: PeriodSummary;
    month: PeriodSummary;
    year: PeriodSummary;
  }> {
    const [today, week, month, year] = await Promise.all([
      this.getPeriodSummary(1),
      this.getPeriodSummary(7),
      this.getPeriodSummary(30),
      this.getPeriodSummary(365)
    ]);

    return { today, week, month, year };
  }

  /**
   * Get request type distribution for the specified period
   */
  static async getRequestTypeDistribution(days: number): Promise<Array<{
    type: string;
    count: number;
    label: string;
    percentage: number;
  }>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('requests')
      .select('request_type')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const typeCounts = {
      quote: 0,
      appointment: 0
    };

    data?.forEach(request => {
      typeCounts[request.request_type as keyof typeof typeCounts]++;
    });

    const total = Object.values(typeCounts).reduce((sum, count) => sum + count, 0);

    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      label: type === 'quote' ? 'Devis' : 'Rendez-vous',
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));
  }
}