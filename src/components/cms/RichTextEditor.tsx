"use client";

import { useEffect, useRef } from "react";
import { AlignLeft, Bold, Italic, Link as LinkIcon, List, ListOrdered, Underline } from "lucide-react";

const TOOLS = [
  { command: "bold", icon: Bold, label: "Bold" },
  { command: "italic", icon: Italic, label: "Italic" },
  { command: "underline", icon: Underline, label: "Underline" },
  { divider: true },
  { command: "justifyLeft", icon: AlignLeft, label: "Align left" },
  { command: "insertUnorderedList", icon: List, label: "Bullet list" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
  { divider: true },
  { command: "createLink", icon: LinkIcon, label: "Link" },
] as const;

export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(command: string) {
    if (command === "createLink") {
      const url = window.prompt("Link URL");
      if (!url) return;
      document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false);
    }
    ref.current?.focus();
    onChange(ref.current?.innerHTML ?? "");
  }

  return (
    <div className="overflow-hidden rounded-lg ring-1 ring-black/10">
      <div className="flex items-center gap-3 bg-cream px-3 py-2">
        {TOOLS.map((tool, i) =>
          "divider" in tool ? (
            <span key={i} className="h-3.5 w-px bg-black/10" />
          ) : (
            <button
              key={tool.command}
              type="button"
              title={tool.label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec(tool.command)}
              className="text-ink-alt/70 hover:text-ink-alt"
            >
              <tool.icon size={14} />
            </button>
          )
        )}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className="min-h-[160px] bg-white px-4 py-4 text-sm leading-relaxed text-ink-alt outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-brand-500 [&_a]:underline"
      />
    </div>
  );
}
