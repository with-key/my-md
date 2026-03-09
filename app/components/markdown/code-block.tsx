import { useEffect, useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

let highlighterPromise: Promise<any> | null = null;

async function getHighlighter() {
  if (!highlighterPromise) {
    const { createHighlighter } = await import("shiki");
    highlighterPromise = createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: [],
    });
  }
  return highlighterPromise;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const highlighter = await getHighlighter();
        const lang = language || "text";

        let effectiveLang = lang;
        if (!highlighter.getLoadedLanguages().includes(lang)) {
          try {
            await highlighter.loadLanguage(lang as any);
          } catch {
            effectiveLang = "text";
            if (!highlighter.getLoadedLanguages().includes("text")) {
              await highlighter.loadLanguage("text");
            }
          }
        }

        const result = highlighter.codeToHtml(code, {
          lang: effectiveLang,
          themes: { light: "github-light", dark: "github-dark" },
        });

        if (!cancelled) setHtml(result);
      } catch {
        if (!cancelled) setHtml("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  if (!html) {
    return (
      <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
