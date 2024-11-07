import { useSanity } from "~/hooks/useSanity";
import { Section } from "./section/Section";
import { SectionContent } from "./section/SectionContent";
import { useEffect } from "react";
import { getEnv } from "~/utils/env.utils";

export function UxSignalsWidget() {
  const { getSetting } = useSanity();
  const uxSignalId = getSetting("uxSignals");
  const enabled = getEnv("UXSIGNALS_ENABLED") === "true";
  const mode = getEnv("UXSIGNALS_MODE") || "demo";

  useEffect(() => {
    if (enabled) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://uxsignals-frontend.uxsignals.app.iterate.no/embed.js";
      document.body.appendChild(script);

      return () => {
        try {
          document.body.removeChild(script);
        } catch {
          console.log("Kunne vise UxSignals widget!");
        }
      };
    }
  }, [enabled]);

  if (!enabled || !uxSignalId) return null;

  return (
    <Section>
      <SectionContent>
        <div
          data-uxsignals-embed={uxSignalId}
          data-uxsignals-mode={mode}
          style={{ maxWidth: 630 }}
        />
      </SectionContent>
    </Section>
  );
}
