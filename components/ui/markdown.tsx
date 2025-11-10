import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";

const components: Partial<Components> = {
  pre: ({ children }) => {
    // Extract the code element and its className for Monaco Editor
    const codeElement = React.Children.toArray(children).find(
      (child): child is React.ReactElement<{ className?: string; children: React.ReactNode }> =>
        React.isValidElement(child) && child.type === 'code'
    );

    if (codeElement && codeElement.props.className) {
      const codeText = typeof codeElement.props.children === 'string' 
        ? codeElement.props.children 
        : React.Children.toArray(codeElement.props.children).join('');
      
      return (
        <CodeBlock className={codeElement.props.className}>
          {codeText}
        </CodeBlock>
      );
    }

    // Fallback for plain pre without syntax highlighting
    return (
      <div className="w-full min-w-0 overflow-x-auto my-4">
        <pre 
          className="bg-muted/80 text-foreground p-3 rounded-lg text-xs sm:text-sm whitespace-pre" 
          style={{ 
            whiteSpace: 'pre', 
            wordBreak: 'keep-all', 
            wordWrap: 'normal', 
            minWidth: 'max-content' 
          }}
        >
          {children}
        </pre>
      </div>
    );
  },
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono break-words" {...props}>
          {children}
        </code>
      );
    }
    // For block code, this will be handled by the pre component above
    return (
      <code className="text-xs sm:text-sm font-mono whitespace-pre" {...props}>
        {children}
      </code>
    );
  },
  ol: ({ children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4 my-2 space-y-1" {...props}>
        {children}
      </ol>
    );
  },
  ul: ({ children, ...props }) => {
    return (
      <ul className="list-disc list-outside ml-4 my-2 space-y-1" {...props}>
        {children}
      </ul>
    );
  },
  li: ({ children, ...props }) => {
    return (
      <li className="text-sm" {...props}>
        {children}
      </li>
    );
  },
  strong: ({ children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  em: ({ children, ...props }) => {
    return (
      <span className="italic" {...props}>
        {children}
      </span>
    );
  },
  h1: ({ children, ...props }) => {
    return (
      <h1 className="text-lg sm:text-xl font-semibold mt-4 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }) => {
    return (
      <h2 className="text-base sm:text-lg font-semibold mt-4 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    return (
      <h3 className="text-sm sm:text-base font-semibold mt-3 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ children, ...props }) => {
    return (
      <h4 className="text-sm font-semibold mt-3 mb-1" {...props}>
        {children}
      </h4>
    );
  },
  table: ({ children, ...props }) => {
    return (
      <div className="w-full min-w-0 overflow-x-auto my-4 border border-border rounded-lg">
        <table className="min-w-full border-collapse" {...props}>
          {children}
        </table>
      </div>
    );
  },
  thead: ({ children, ...props }) => {
    return (
      <thead className="bg-muted/50" {...props}>
        {children}
      </thead>
    );
  },
  tbody: ({ children, ...props }) => {
    return (
      <tbody {...props}>
        {children}
      </tbody>
    );
  },
  tr: ({ children, ...props }) => {
    return (
      <tr className="border-b border-border/50 hover:bg-muted/30" {...props}>
        {children}
      </tr>
    );
  },
  th: ({ children, ...props }) => {
    return (
      <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold whitespace-nowrap" {...props}>
        {children}
      </th>
    );
  },
  td: ({ children, ...props }) => {
    return (
      <td className="px-3 py-2 text-xs sm:text-sm whitespace-nowrap" {...props}>
        {children}
      </td>
    );
  },
  p: ({ children, ...props }) => {
    return (
      <p className="text-xs sm:text-sm leading-relaxed my-2" {...props}>
        {children}
      </p>
    );
  },
  blockquote: ({ children, ...props }) => {
    return (
      <blockquote className="border-l-4 border-muted pl-4 my-3 italic text-muted-foreground" {...props}>
        {children}
      </blockquote>
    );
  },
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <div className="markdown-content w-full min-w-0">
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);