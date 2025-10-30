'use client';
import { useEffect } from 'react';
import posthog from 'posthog-js';

export default function TrackEvent() {
  useEffect(() => {
    if (typeof window !== 'undefined' && posthog.has_opted_in_capturing()) {
      posthog.capture('event_nextjs', {
        property1: 'value1',
        property2: 'value2',
      });
    }
  }, []);

  return null;
}
