import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Type for profiles table
type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Service for interacting with Supabase database
 */
export const supabaseService = {
  /**
   * Fetch all profiles
   */
  async getAllProfiles(): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllProfiles:', error);
      throw error;
    }
  },

  /**
   * Fetch a profile by ID
   */
  async getProfileById(id: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getProfileById:', error);
      throw error;
    }
  },

  /**
   * Update a profile
   */
  async updateProfile(id: string, profile: Partial<Profile>): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  },

  /**
   * Generic function to fetch data from any table
   */
  async fetchData<T>(table: string, query?: {
    filters?: Record<string, unknown>;
    order?: { column: string; ascending: boolean };
    pagination?: { from: number; to: number };
  }): Promise<T[]> {
    try {
      let queryBuilder = supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from(table as any)
        .select('*');

      // Apply filters if provided
      if (query?.filters) {
        for (const [column, value] of Object.entries(query.filters)) {
          queryBuilder = queryBuilder.eq(column, value);
        }
      }

      // Apply order if provided
      if (query?.order) {
        const { column, ascending } = query.order;
        queryBuilder = queryBuilder.order(column, { ascending });
      }

      // Apply pagination if provided
      if (query?.pagination) {
        const { from, to } = query.pagination;
        queryBuilder = queryBuilder.range(from, to);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error(`Error fetching data from ${table}:`, error);
        throw error;
      }

      return data as T[] || [];
    } catch (error) {
      console.error(`Error in fetchData for ${table}:`, error);
      throw error;
    }
  },

  /**
   * Generic function to insert data into any table
   */
  async insertData<T>(table: string, data: Record<string, unknown>): Promise<T | null> {
    try {
      const { data: result, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from(table as any)
        .insert(data)
        .select()
        .maybeSingle();

      if (error) {
        console.error(`Error inserting data into ${table}:`, error);
        throw error;
      }

      return result as T;
    } catch (error) {
      console.error(`Error in insertData for ${table}:`, error);
      throw error;
    }
  },

  /**
   * Generic function to update data in any table
   */
  async updateData<T>(table: string, id: string | number, data: Record<string, unknown>, idColumn: string = 'id'): Promise<T | null> {
    try {
      const { data: result, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from(table as any)
        .update(data)
        .eq(idColumn, id)
        .select()
        .maybeSingle();

      if (error) {
        console.error(`Error updating data in ${table}:`, error);
        throw error;
      }

      return result as T;
    } catch (error) {
      console.error(`Error in updateData for ${table}:`, error);
      throw error;
    }
  },

  /**
   * Generic function to delete data from any table
   */
  async deleteData(table: string, id: string | number, idColumn: string = 'id'): Promise<void> {
    try {
      const { error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from(table as any)
        .delete()
        .eq(idColumn, id);

      if (error) {
        console.error(`Error deleting data from ${table}:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`Error in deleteData for ${table}:`, error);
      throw error;
    }
  }
};