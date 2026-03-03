interface GtagEvent {
  (command: 'config', targetId: string, config?: Record<string, unknown>): void;
  (command: 'event', eventName: string, eventParams?: Record<string, unknown>): void;
  (command: 'consent', action: 'default' | 'update', params: Record<string, string>): void;
  (command: 'set', params: Record<string, unknown>): void;
}

interface Window {
  gtag: GtagEvent;
  dataLayer: unknown[];
}
