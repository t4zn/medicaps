import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";

const components: Partial<Components> = {
  pre: ({ children }) => {
    console.log('📝 Markdown pre component called with children:', children)
    
    // Handle the case where children is a single React element
    let codeElement: React.ReactElement<{ className?: string; children: React.ReactNode }> | null = null;
    
    if (React.isValidElement(children) && children.type === 'code') {
      codeElement = children as React.ReactElement<{ className?: string; children: React.ReactNode }>;
    } else {
      // Try to find code element in children array
      const childrenArray = React.Children.toArray(children);
      codeElement = childrenArray.find(
        (child): child is React.ReactElement<{ className?: string; children: React.ReactNode }> =>
          React.isValidElement(child) && child.type === 'code'
      ) || null;
    }

    console.log('📝 Found code element:', {
      found: !!codeElement,
      props: codeElement?.props,
      type: codeElement?.type
    })

    if (codeElement && codeElement.props) {
      const codeText = typeof codeElement.props.children === 'string' 
        ? codeElement.props.children 
        : React.Children.toArray(codeElement.props.children).join('');
      
      console.log('📝 Using CodeBlock with:', {
        className: codeElement.props.className || 'no-class',
        codeText: codeText.substring(0, 50) + '...'
      })
      
      return (
        <CodeBlock className={codeElement.props.className || 'language-text'}>
          {codeText}
        </CodeBlock>
      );
    }

    // Fallback: Force all pre content through Monaco CodeBlock with smart language detection
    console.log('📝 Using Monaco CodeBlock fallback for all pre content')
    
    const fallbackText = typeof children === 'string' 
      ? children 
      : React.Children.toArray(children).map(child => {
          if (typeof child === 'string') return child;
          if (React.isValidElement(child) && child.props && typeof (child.props as { children?: string }).children === 'string') {
            return (child.props as { children?: string }).children;
          }
          return '';
        }).join('');
    
    console.log('📝 Fallback text:', fallbackText.substring(0, 50) + '...')
    
    // Smart language detection based on code content
    const detectLanguage = (code: string): string => {
      const trimmedCode = code.trim().toLowerCase();
      
      // Python detection
      if (trimmedCode.includes('def ') || trimmedCode.includes('class ') || 
          trimmedCode.includes('import ') || trimmedCode.includes('from ') ||
          trimmedCode.includes('print(') || trimmedCode.includes('if __name__')) {
        return 'language-python';
      }
      
      // JavaScript/TypeScript detection
      if (trimmedCode.includes('function ') || trimmedCode.includes('const ') ||
          trimmedCode.includes('let ') || trimmedCode.includes('var ') ||
          trimmedCode.includes('console.log') || trimmedCode.includes('=>')) {
        return trimmedCode.includes('interface ') || trimmedCode.includes('type ') ? 'language-typescript' : 'language-javascript';
      }
      
      // Java detection
      if (trimmedCode.includes('public class ') || trimmedCode.includes('public static void main') ||
          trimmedCode.includes('System.out.println')) {
        return 'language-java';
      }
      
      // C/C++ detection
      if (trimmedCode.includes('#include') || trimmedCode.includes('int main(') ||
          trimmedCode.includes('printf(') || trimmedCode.includes('cout <<')) {
        return trimmedCode.includes('cout') || trimmedCode.includes('std::') ? 'language-cpp' : 'language-c';
      }
      
      // HTML detection
      if (trimmedCode.includes('<html') || trimmedCode.includes('<!doctype') ||
          (trimmedCode.includes('<') && trimmedCode.includes('>'))) {
        return 'language-html';
      }
      
      // CSS detection
      if (trimmedCode.includes('{') && trimmedCode.includes('}') && 
          (trimmedCode.includes(':') || trimmedCode.includes('px') || trimmedCode.includes('color'))) {
        return 'language-css';
      }
      
      // SQL detection
      if (trimmedCode.includes('select ') || trimmedCode.includes('insert ') ||
          trimmedCode.includes('update ') || trimmedCode.includes('delete ') ||
          trimmedCode.includes('create table')) {
        return 'language-sql';
      }
      
      // Bash/Shell detection
      if (trimmedCode.startsWith('#!/bin/bash') || trimmedCode.startsWith('#!/bin/sh') ||
          trimmedCode.includes('echo ') || trimmedCode.includes('cd ') ||
          trimmedCode.includes('ls ') || trimmedCode.includes('grep ')) {
        return 'language-bash';
      }
      
      return 'language-text';
    };
    
    const detectedLanguage = detectLanguage(fallbackText);
    console.log('📝 Detected language:', detectedLanguage);
    
    return (
      <CodeBlock className={detectedLanguage}>
        {fallbackText}
      </CodeBlock>
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