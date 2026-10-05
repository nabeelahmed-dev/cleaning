export type Bubble = {
  /** Tailwind position classes, e.g. "left-[6%] top-[14%]". Must be unique per field. */
  position: string;
  /** Tailwind size and opacity classes. */
  size: string;
  /** Scroll parallax distance in px. */
  parallax: number;
  /** How many px the bubble drifts toward the pointer (bigger feels nearer). */
  depth: number;
  /** Negative delay so the idle floats are out of step. */
  delay: string;
};

// Bubbles that react to the cursor. The parent section needs `data-pointer-field`
// and `relative overflow-hidden`; the motion itself lives in Animations.tsx.
export function BubbleField({ bubbles }: { bubbles: Bubble[] }) {
  return (
    <>
      {/* Three nested layers per bubble so the motions don't fight over one
          transform: scroll parallax > pointer drift > idle float. */}
      {bubbles.map((bubble) => (
        <span key={bubble.position} data-parallax={bubble.parallax} className={`absolute ${bubble.position}`}>
          <span data-depth={bubble.depth} className="block">
            <span
              className={`bubble block animate-float ${bubble.size}`}
              style={{ animationDelay: bubble.delay }}
            />
          </span>
        </span>
      ))}
      {/* One bubble trails the cursor while it is over the section. */}
      <span data-cursor-bubble className="pointer-events-none absolute left-0 top-0 opacity-0">
        <span className="bubble block h-16 w-16" />
      </span>
    </>
  );
}
