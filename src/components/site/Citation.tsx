/**
 * Renders a scripture reference, setting verse-part letters ("2:11 a" → "2:11ᴀ") in small caps.
 * Works inside uppercase captions: the letter opts out of the uppercase transform so small-caps applies.
 */
export function Citation({ text }: { text: string }) {
  const parts = text.split(/(?<=\d)\s?([a-z])\b/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="normal-case [font-variant-caps:small-caps]">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
