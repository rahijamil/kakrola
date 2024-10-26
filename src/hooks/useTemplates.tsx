import { ChannelTemplate, PageTemplate, ProjectTemplate } from "@/types/templateTypes";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useTemplates = (category?: string) => {
  return useQuery({
    queryKey: ['templates', category],
    queryFn: async () => {
      let query = supabaseBrowser
        .from("templates")
        .select("*");
      
      // if (category && category !== 'featured') {
      //   query = query.eq('category', category);
      // } else if (category === 'featured') {
      //   query = query.eq('is_featured', true);
      // }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as (ProjectTemplate | PageTemplate | ChannelTemplate)[];
    }
  });
};