// Ring of the firm's disciplines set on a circle. Decorative, hidden from assistive tech.
// Two nested wrappers so the idle turn and the scroll turn never write the same transform.
// Arabic is set without textLength: stretching inter-glyph space would break letter joins.

export default function Seal({ text, arabic = false }: { text: string; arabic?: boolean }) {
  return (
    <div className="seal" aria-hidden="true">
      <div className="seal__scroll" data-seal-scroll>
        <div className="seal__idle" data-seal-idle>
          <svg viewBox="0 0 400 400" className="seal__svg">
            <defs>
              <path id="seal-circle" d="M200,200 m-168,0 a168,168 0 1,1 336,0 a168,168 0 1,1 -336,0" />
            </defs>
            <circle cx="200" cy="200" r="196" className="seal__ring seal__ring--outer" />
            <circle cx="200" cy="200" r="140" className="seal__ring" />
            <text className="seal__text" direction={arabic ? 'rtl' : undefined}>
              <textPath href="#seal-circle" startOffset="0" textLength={arabic ? undefined : 1040}>
                {arabic ? text + text : text}
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
