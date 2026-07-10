import { describe, expect, it, vi } from 'vitest';

import { createKnowledgeHubService } from '@/services/knowledge-hub.service';

describe('createKnowledgeHubService', () => {
  it('parses knowledge query response envelope', async () => {
    const fetch = vi.fn().mockResolvedValue({
      success: true,
      data: {
        answer: 'Stub answer',
        citations: [{ source: 'SOP-1', excerpt: 'Follow LOTO', page: 1 }],
      },
    });

    const service = createKnowledgeHubService(fetch as never);
    const result = await service.query({ query: 'lockout' });

    expect(fetch).toHaveBeenCalledWith('/knowledge/query', {
      method: 'POST',
      body: { query: 'lockout' },
    });
    expect(result.answer).toBe('Stub answer');
    expect(result.citations).toHaveLength(1);
  });
});
