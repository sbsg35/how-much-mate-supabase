import { useEffect, useRef, useState } from "react";
import { FieldValues, Path, UseFormSetValue } from "react-hook-form";

interface UseTurnstileOptions<T extends FieldValues> {
  siteKey: string;
  onVerify?: (token: string) => void;
  formSetValue: UseFormSetValue<T>;
  formFieldName: Path<T>;
}

interface UseTurnstileReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  token: string | null;
  reset: () => void;
  isLoaded: boolean;
  isVerified: boolean;
}

export const useTurnstile = <T extends FieldValues>({
  siteKey,
  onVerify,
  formSetValue,
  formFieldName,
}: UseTurnstileOptions<T>): UseTurnstileReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Function to reset the Turnstile widget
  const reset = () => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      setToken(null);
      setIsVerified(false);

      // If form integration is enabled, reset the form field
      if (formSetValue && formFieldName) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formSetValue(formFieldName, "" as any, { shouldValidate: false });
      }
    }
  };

  useEffect(() => {
    // Function to render the Turnstile widget
    const renderTurnstile = () => {
      if (containerRef.current && window.turnstile) {
        // Reset any existing widget
        if (widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
          window.turnstile.remove(widgetIdRef.current);
        }

        // Render the widget
        const widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (turnstileToken: string) => {
            setToken(turnstileToken);
            setIsVerified(true);

            // If form integration is enabled, set the form field
            if (formSetValue && formFieldName) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formSetValue(formFieldName, turnstileToken as any, {
                shouldValidate: false,
              });
            }

            // Call the onVerify callback if provided
            if (onVerify) {
              onVerify(turnstileToken);
            }
          },
        });

        widgetIdRef.current = widgetId;
        setIsLoaded(true);
      }
    };

    // Check if Turnstile is already loaded
    if (window.turnstile) {
      renderTurnstile();
    } else {
      // If not loaded yet, set up a listener for when the script loads
      const handleTurnstileLoad = () => {
        renderTurnstile();
      };

      window.addEventListener("turnstileLoaded", handleTurnstileLoad);

      return () => {
        window.removeEventListener("turnstileLoaded", handleTurnstileLoad);
      };
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    };
  }, [siteKey, onVerify, formSetValue, formFieldName]);

  return {
    containerRef,
    token,
    reset,
    isLoaded,
    isVerified,
  };
};
