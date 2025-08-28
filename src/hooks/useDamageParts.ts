import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DamagePart {
  id: string;
  name: string;
  description: string;
}

export const useDamageParts = () => {
  return useQuery({
    queryKey: ['damage-parts'],
    queryFn: async (): Promise<DamagePart[]> => {
      const { data, error } = await supabase
        .from('damage_parts')
        .select('id, name, description')
        .order('name');

      if (error) {
        throw error;
      }

      return data || [];
    },
  });
};