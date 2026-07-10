'use client';

import { useCallback, useMemo, useState } from 'react';
import { createKnowledgeHubService } from '@/services/knowledge-hub.service';
import type { KnowledgeQueryData } from '@portal/models/knowledge-hub';

export function useKnowledgeHubQuery() {
  const service = useMemo(() => createKnowledgeHubService(), []);
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<KnowledgeQueryData | null>(null);
  const [query, setQuery] = useState('');

  const submit = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setErrorMsg('Enter a question');
      return;
    }
    setPending(true);
    setErrorMsg(null);
    try {
      const data = await service.query({ query: trimmed });
      setResult(data);
    } catch (error: unknown) {
      setErrorMsg((error as Error)?.message ?? 'Query failed');
      setResult(null);
    } finally {
      setPending(false);
    }
  }, [query, service]);

  return {
    query,
    setQuery,
    pending,
    errorMsg,
    result,
    submit,
  };
}
