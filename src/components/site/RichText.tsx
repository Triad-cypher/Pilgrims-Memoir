export function RichText({ html, className = "" }: { html: string; className?: string }) {
  return (
    <div
      className={`prose-devotional [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-brand-500 [&_a]:underline ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
