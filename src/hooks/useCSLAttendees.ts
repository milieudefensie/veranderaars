import { useState, useCallback } from 'react';

interface AttendeesResponse {
  isWaitingListActive: boolean;
  attendeesCount: number;
  message?: string;
}

interface UseCSLAttendeesOptions {
  slug: string;
  maxAttendeesCount: number;
}

export function useCSLAttendees() {
  const [data, setData] = useState<AttendeesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendees = useCallback(async ({ slug, maxAttendeesCount }: UseCSLAttendeesOptions) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/get-csl-attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { slug, max_attendees_count: maxAttendeesCount },
        }),
      });

      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      const json: AttendeesResponse = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchAttendees };
}
