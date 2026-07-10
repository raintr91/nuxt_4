import {
  KnowledgeQueryDataSchema,
  type KnowledgeQueryData,
  type KnowledgeQueryRequest,
} from '@portal/models/knowledge-hub';
import type { ApiResponse } from '@portal/models/common/api.types';
import { apiFetch } from '@/lib/api-client';
import { assertApiSuccess, parseApiData } from '@/services/shared/api-response';

type ApiFetch = typeof apiFetch;

export function createKnowledgeHubService(fetch: ApiFetch = apiFetch) {
  return {
    async query(payload: KnowledgeQueryRequest): Promise<KnowledgeQueryData> {
      const res = await fetch<ApiResponse<unknown>>('/knowledge/query', {
        method: 'POST',
        body: payload,
      });
      assertApiSuccess(res);
      return parseApiData(KnowledgeQueryDataSchema, res.data);
    },
  };
}

export type KnowledgeHubService = ReturnType<typeof createKnowledgeHubService>;
