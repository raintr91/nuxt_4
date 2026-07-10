'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useKnowledgeHubQuery } from '@/hooks/knowledge-hub/useKnowledgeHubQuery';

export default function KnowledgeHubPage() {
  const { query, setQuery, pending, errorMsg, result, submit } = useKnowledgeHubQuery();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6" data-testid="knowledge-hub-page">
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Hub</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Textarea
            data-testid="knowledge-hub-query-input"
            placeholder="Ask about SOP, manual, ISO…"
            rows={4}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            data-testid="knowledge-hub-submit-btn"
            disabled={pending}
            onClick={() => void submit()}
            type="button"
          >
            {pending ? 'Searching…' : 'Search'}
          </Button>
          {errorMsg ? <p className="text-sm text-destructive">{errorMsg}</p> : null}
          {result ? (
            <div className="space-y-3" data-testid="knowledge-hub-answer">
              <p className="text-sm font-medium">Answer</p>
              <p className="text-sm whitespace-pre-wrap">{result.answer}</p>
              {result.citations?.length ? (
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {result.citations.map((citation, index) => (
                    <li key={`${citation.source}-${index}`}>
                      {citation.source}: {citation.excerpt}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
