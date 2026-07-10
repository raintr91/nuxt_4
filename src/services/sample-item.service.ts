import {
  SampleItemListResponseSchema,
  type SampleItemListResponse,
} from '@portal/models/sample-item';
import type { ApiResponse } from '@portal/models/common/api.types';
import { apiFetch } from '@/lib/api-client';
import { assertApiSuccess, parseApiData } from '@/services/shared/api-response';

type ApiFetch = typeof apiFetch;

export type SampleItemSearchParams = Record<string, unknown> & {
  page?: number;
  per_page?: number;
};

export function createSampleItemService(fetch: ApiFetch = apiFetch) {
  return {
    async search(params?: SampleItemSearchParams): Promise<SampleItemListResponse> {
      const res = await fetch<ApiResponse<unknown>>('/sample-items', {
        method: 'GET',
        query: params
      });
      assertApiSuccess(res);
      return parseApiData(SampleItemListResponseSchema, res.data);
    }
  };
}

export type SampleItemService = ReturnType<typeof createSampleItemService>;
