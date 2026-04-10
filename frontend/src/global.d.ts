// Declare the Turnstile global type
declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: unknown) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export {};
