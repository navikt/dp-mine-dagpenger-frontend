import { useEffect } from "react";

interface ClientScriptProps {
  env: Record<string, string | undefined>;
}

export function ClientScript({ env }: ClientScriptProps) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (window as any).env = env;
  }, [env]);

  return null;
}
