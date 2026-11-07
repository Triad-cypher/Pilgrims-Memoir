/**
 * Renders a scripture reference, keeping verse-part letters lowercase ("2:11 a" → "2:11a").
 * The letter opts out of any uppercase transform on the surrounding caption.
 */
export function Citation({ text }: { text: string }) {
  const parts = text.split(/(?<=\d)\s?([a-z])\b/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="normal-case">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
