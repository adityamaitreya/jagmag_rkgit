import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';

/**
 * Custom hook for fetching data from Supabase
 * @param table The table name to fetch data from
 * @param query Optional query parameters (filters, order, pagination)
 * @param dependencies Optional dependencies array to trigger refetch
 */
export function useSupabaseQuery<T>(
  table: string,
  query?: {
    filters?: Record<string, unknown>;
    order?: { column: string; ascending: boolean };
    pagination?: { from: number; to: number };
  },
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await supabaseService.fetchData<T>(table, query);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, JSON.stringify(query), ...dependencies]);

  const refetch = async () => {
    try {
      setLoading(true);
      const result = await supabaseService.fetchData<T>(table, query);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

/**
 * Custom hook for fetching a single item by ID from Supabase
 * @param table The table name to fetch data from
 * @param id The ID of the item to fetch
 * @param idColumn The column name for the ID (default: 'id')
 * @param dependencies Optional dependencies array to trigger refetch
 */
export function useSupabaseItem<T>(
  table: string,
  id: string | number | null,
  idColumn: string = 'id',
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchItem = async () => {
      try {
        setLoading(true);
        const result = await supabaseService.fetchData<T>(table, {
          filters: { [idColumn]: id },
        });
        setData(result[0] || null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [table, id, idColumn, ...dependencies]);

  const refetch = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const result = await supabaseService.fetchData<T>(table, {
        filters: { [idColumn]: id },
      });
      setData(result[0] || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

/**
 * Custom hook for managing mutations (insert, update, delete) in Supabase
 * @param table The table name to perform mutations on
 */
export function useSupabaseMutation<T>(
  table: string
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const insert = async (data: Record<string, unknown>): Promise<T | null> => {
    try {
      setLoading(true);
      const result = await supabaseService.insertData<T>(table, data);
      setError(null);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(errorMessage);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string | number, data: Record<string, unknown>, idColumn: string = 'id'): Promise<T | null> => {
    try {
      setLoading(true);
      const result = await supabaseService.updateData<T>(table, id, data, idColumn);
      setError(null);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(errorMessage);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string | number, idColumn: string = 'id'): Promise<void> => {
    try {
      setLoading(true);
      await supabaseService.deleteData(table, id, idColumn);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(errorMessage);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  };

  return { insert, update, remove, loading, error };
}