import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeRaw from "rehype-raw";
import { CodeBlock } from "./code-block";

interface MarkdownRendererProps {
  content: string;
  currentFilePath?: string | null;
  onLinkClick?: (filePath: string, fileName: string) => void;
}

function remarkFrontmatterToCodeBlock() {
  return (tree: { children: Array<{ type: string; value?: string; lang?: string }> }) => {
    tree.children = tree.children.map((node) => {
      if (node.type === "yaml" && typeof node.value === "string") {
        return { type: "code", lang: "yaml", value: node.value };
      }
      return node;
    });
  };
}

function isRelativeMarkdownLink(href: string): boolean {
  if (!href) return false;
  if (/^https?:\/\/|^mailto:|^#/.test(href)) return false;
  const pathWithoutHash = href.split("#")[0];
  return /\.(md|markdown)$/i.test(pathWithoutHash);
}

function resolveRelativePath(currentFilePath: string, href: string): string {
  const pathWithoutHash = href.split("#")[0];
  const dir = currentFilePath.substring(0, currentFilePath.lastIndexOf("/"));
  const parts = `${dir}/${pathWithoutHash}`.split("/");
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === "..") resolved.pop();
    else if (part !== "." && part !== "") resolved.push(part);
  }
  return "/" + resolved.join("/");
}

export function MarkdownRenderer({ content, currentFilePath, onLinkClick }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none px-8 py-6">
      <Markdown
        remarkPlugins={[remarkGfm, remarkFrontmatter, remarkFrontmatterToCodeBlock]}
        rehypePlugins={[rehypeRaw]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, node, ref, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            if (match) {
              return <CodeBlock code={codeString} language={match[1]} />;
            }

            if (codeString.includes("\n")) {
              return <CodeBlock code={codeString} />;
            }

            return (
              <code
                className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          a: ({ href, children, ...props }) => {
            if (href && currentFilePath && onLinkClick && isRelativeMarkdownLink(href)) {
              const resolved = resolveRelativePath(currentFilePath, href);
              const fileName = resolved.substring(resolved.lastIndexOf("/") + 1);
              return (
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    onLinkClick(resolved, fileName);
                  }}
                  className="cursor-pointer"
                  {...props}
                >
                  {children}
                </a>
              );
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
