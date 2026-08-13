import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../utils/cn";

const MARKDOWN_COMPONENTS: Components = {
  h1: ({ children }) => (
    <h1 className="mt-6 mb-3 text-2xl leading-8 font-semibold text-gray-900">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-6 mb-3 text-xl leading-7 font-semibold text-gray-900">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-5 mb-2 text-lg leading-7 font-semibold text-gray-900">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-4 mb-2 text-base leading-6 font-semibold text-gray-900">
      {children}
    </h4>
  ),
  p: ({ children }) => <p className="my-3">{children}</p>,
  ul: ({ children }) => (
    <ul className="my-3 list-disc space-y-1 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 list-decimal space-y-1 pl-5">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1 [&>p]:my-0">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-main-300 my-4 border-l-4 pl-4 text-gray-700">
      {children}
    </blockquote>
  ),
  a: ({ children, href, title }) => {
    const isExternal = href?.startsWith("http");

    return (
      <a
        href={href}
        title={title}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="text-main-700 break-all underline underline-offset-2"
      >
        {children}
      </a>
    );
  },
  code: ({ children, className }) => (
    <code
      className={cn(
        "rounded bg-gray-100 px-1 py-0.5 font-mono text-[13px] leading-5 text-gray-900",
        className,
      )}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-[8px] bg-gray-900 p-4 text-gray-50 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-5 border-gray-400" />,
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-gray-400 bg-gray-100 px-3 py-2 font-semibold text-gray-900">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-400 px-3 py-2 align-top">{children}</td>
  ),
  img: ({ src, alt, title }) => (
    <img
      src={src}
      alt={alt ?? ""}
      title={title}
      className="my-4 max-w-full rounded-[8px]"
    />
  ),
};

interface MarkdownContentProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> {
  content: string;
}

export const MarkdownContent = ({
  content,
  className,
  ...props
}: MarkdownContentProps) => (
  <div
    className={cn(
      "min-w-0 text-base leading-6 font-normal break-words text-gray-900 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
      className,
    )}
    {...props}
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={MARKDOWN_COMPONENTS}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default MarkdownContent;
