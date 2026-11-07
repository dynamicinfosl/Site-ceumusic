import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../../../utils/supabase';
import { clearContentCache } from '../../../utils/content';

export interface PanelMessage {
  type: 'success' | 'error';
  text: string;
}

export function describeSaveError(error: { code?: string; message?: string }): string {
  if (error.code === '42501') return 'Sua conta não tem permissão para alterar o conteúdo do site.';
  return `Não foi possível salvar: ${error.message ?? 'erro desconhecido'}`;
}

interface OrderedListOptions<T> {
  table: string;
  successText: string;
  // Devolve o texto do problema, ou null se a lista puder ser salva
  validate?: (items: T[]) => string | null;
  prepare?: (item: T) => T;
}

// Lista editada no painel: as alterações, a ordem e as remoções só valem ao salvar.
export function useOrderedList<T extends { id: string }>({ table, successText, validate, prepare }: OrderedListOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<PanelMessage | null>(null);
  const savedIds = useRef<string[]>([]);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from(table).select('*').order('order_index', { ascending: true });
    if (error) {
      setMessage({ type: 'error', text: `Não foi possível carregar: ${error.message}` });
    } else {
      setItems((data ?? []) as T[]);
      savedIds.current = (data ?? []).map((row: { id: string }) => row.id);
    }
    setLoading(false);
  }, [table]);

  useEffect(() => {
    load();
  }, [load]);

  const update = (id: string, patch: Partial<T>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const add = (item: T) => setItems((current) => [...current, item]);

  const remove = (id: string, label: string) => {
    const isSaved = savedIds.current.includes(id);
    if (isSaved && !window.confirm(`Remover "${label || 'este item'}"? A remoção vale quando você salvar.`)) return;
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const move = (id: string, direction: -1 | 1) => {
    setItems((current) => {
      const from = current.findIndex((item) => item.id === id);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= current.length) return current;
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };

  const save = async (): Promise<boolean> => {
    if (!supabase) return false;
    const problem = validate?.(items);
    if (problem) {
      setMessage({ type: 'error', text: problem });
      return false;
    }

    setSaving(true);
    setMessage(null);
    try {
      const rows = items.map((item, index) => {
        const { created_at: _createdAt, ...row } = (prepare ? prepare(item) : item) as T & { created_at?: string };
        return { ...row, order_index: index };
      });
      if (rows.length > 0) {
        const { error } = await supabase.from(table).upsert(rows);
        if (error) throw error;
      }

      const currentIds = new Set(items.map((item) => item.id));
      const removedIds = savedIds.current.filter((id) => !currentIds.has(id));
      if (removedIds.length > 0) {
        const { error } = await supabase.from(table).delete().in('id', removedIds);
        if (error) throw error;
      }

      clearContentCache();
      await load();
      setMessage({ type: 'success', text: successText });
      return true;
    } catch (error) {
      setMessage({ type: 'error', text: describeSaveError(error as { code?: string; message?: string }) });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { items, loading, saving, message, setMessage, update, add, remove, move, save };
}

export async function saveSetting(key: string, value: unknown) {
  if (!supabase) throw new Error('Banco de dados não configurado');
  const { error } = await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
  clearContentCache();
}
